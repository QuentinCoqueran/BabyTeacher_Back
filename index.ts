import {config} from "dotenv";

config();

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
    ContractController
} from "./controllers";


import {db} from "./utils";




async function startServer(): Promise<void> {

    const app = express();
    app.listen(process.env.PORT, function () {
        console.log("Server listening on port " + process.env.PORT);
    });
    db.connect();

    let cors = require('cors');
    // use it before all route definitions
    app.use(cors(process.env.FRONT_URL));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());

    const categorieController = new CategorieController();
    app.use('/categorie', categorieController.buildRoutes());

    const testController = new TestController();
    app.use('/test', testController.buildRoutes());

    const postController = new PostController();
    app.use('/post', postController.buildRoutes());

    const availabilityController = new AvailabilityController();
    app.use('/availability', availabilityController.buildRoutes());

    const commentController = new CommentController();
    app.use('/comment', commentController.buildRoutes());

    const contractController = new ContractController();
    app.use('/contract', contractController.buildRoutes());

    const messageController = new MessageController();
    app.use('/message', messageController.buildRoutes());

    const roleController = new RoleController();
    app.use('/role', roleController.buildRoutes());

    const sessionController = new SessionController();
    app.use('/session', sessionController.buildRoutes());

    const signalementController = new SignalementController();
    app.use('/signalement', signalementController.buildRoutes());

}

startServer().catch(console.error);