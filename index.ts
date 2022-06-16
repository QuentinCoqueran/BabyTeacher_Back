import {config} from "dotenv";

config();

import express from "express";
import {AuthController} from "./controllers/auth.controller";
import {db} from "./utils/mysql.connector";
import {TestController} from "./controllers/test.controller";
import {CategorieController} from "./controllers/categorie.controller";


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
}

startServer().catch(console.error);