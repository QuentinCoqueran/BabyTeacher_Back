import {config} from "dotenv";

config();

import express from "express";
import {AuthController} from "./controllers/auth.controller";
import {db} from "./utils/mysql.connector";


async function startServer(): Promise<void> {

    const app = express();
    app.listen(process.env.PORT, function () {
        console.log("Server listening on port " + process.env.PORT);
    });

    db.connect();

    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: 'http://localhost:4200'}));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
}

startServer().catch(console.error);