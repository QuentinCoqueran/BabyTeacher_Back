import {config} from "dotenv";

config();

import express from "express";
import {AuthController, CategorieController, TestController, PostController} from "./controllers";
import {db} from "./utils/mysql.connector";
import mongoose, {Mongoose} from "mongoose";
import {MessageController} from "./controllers/message.controller";
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
        cors: {origin: 'http://localhost:4200'}
    });
    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: 'http://localhost:4200'}));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());

    const categorieController = new CategorieController();
    app.use('/categorie', categorieController.buildRoutes());

    const testController = new TestController();
    app.use('/test', testController.buildRoutes());

    const postController = new PostController();
    app.use('/post', postController.buildRoutes());

    const messageController = new MessageController();
    app.use('/message', messageController.buildRoutes());

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