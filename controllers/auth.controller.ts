import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";


export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().subscribeUser({
                pseudo: req.body.username,
                password: req.body.password,
                lastname: req.body.lastname,
                name: req.body.name
            });
            res.send({
                response: user
            });
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async logUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await AuthService.getInstance().logIn({
                login: req.body.username,
                password: req.body.password
            }, platform);
            res.send({
                token: session
            });
        } catch (err) {
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/login', express.json(), this.logUser.bind(this));
        return router;
    }
}
