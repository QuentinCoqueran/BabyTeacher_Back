import {config} from "dotenv";

config();

import express from "express";



async function startServer(): Promise<void> {
    const app = express();
    app.listen(process.env.PORT, function () {
        console.log("Server listening on port " + process.env.PORT);
    });
}

startServer().catch(console.error);