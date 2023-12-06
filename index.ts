import express from "express";

import {
    AuthController,
    CategorieController,
    TestController,
    PostController,
    MessageController,
    RoleController,
    SessionController,
    SignalementController,
    AvailabilityController,
    CommentController,
    ContractController,
    AdminController,
    ActivityZoneController
} from "./controllers";

import {db} from "./utils/mysql.connector";
import mongoose, {Mongoose} from "mongoose";
import http from "http";
import {MessageService} from "./services";

async function startServer(): Promise<void> {
    // ---> connexion à MonGo BD
    try {
        const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
            auth: {
                username: process.env.MONGO_USER as string,
                password: process.env.MONGO_PASSWORD as string
            }
        });
    } catch (e) {
        console.log(e)
    }

    db.connect();

    const port = process.env.PORT || 3000;
    const app = express();
    const httpServer = http.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: {origin: process.env.FRONT_URL}
    });
    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: process.env.FRONT_URL}));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/api/auth', authController.buildRoutes());

    const categorieController = new CategorieController();
    app.use('/api/categorie', categorieController.buildRoutes());

    const testController = new TestController();
    app.use('/api/test', testController.buildRoutes());

    const postController = new PostController();
    app.use('/api/post', postController.buildRoutes());

    const availabilityController = new AvailabilityController();
    app.use('/api/availability', availabilityController.buildRoutes());

    const commentController = new CommentController();
    app.use('/api/comment', commentController.buildRoutes());

    const contractController = new ContractController();
    app.use('/api/contract', contractController.buildRoutes());

    const messageController = new MessageController();
    app.use('/api/message', messageController.buildRoutes());

    const roleController = new RoleController();
    app.use('/api/role', roleController.buildRoutes());

    const sessionController = new SessionController();
    app.use('/api/session', sessionController.buildRoutes());

    const signalementController = new SignalementController();
    app.use('/api/signalement', signalementController.buildRoutes());

    const adminController = new AdminController();
    app.use('/api/admin', adminController.buildRoutes());

    const activityZoneController = new ActivityZoneController();
    app.use('/api/activityZone', activityZoneController.buildRoutes());

    io.on('connection', (socket: any) => {
        socket.on('createRoom', async (data: any) => {
            socket.join(data.idSession);
        });
        socket.on('data', (data: any) => {
            io.sockets.in(data.userId).emit('eventToClient', {idUser: data.idUser, message: data.message});
        });
    });
    
    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer().catch(console.error);
