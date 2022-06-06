import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";


export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body.age);
            const user = await AuthService.getInstance().subscribeUser({
                login: req.body.login,
                password: req.body.password,
                lastname: req.body.lastname,
                name: req.body.name,
                role: req.body.role,
                age: req.body.age,
                sexe: req.body.sexe,
                //photo: req.body.photo,
                email: req.body.email,
                //description: req.body.description
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
        //const platform = req.headers['user-agent'] || "Unknown";
        let firstConnectionBool = false;
        try {
            const session = await AuthService.getInstance().logIn({
                login: req.body.login,
                password: req.body.password
            });//, platform);
            const userId = await AuthService.getInstance().getUserByToken(session);
            const role = await AuthService.getInstance().getRoleByUserId(userId[0].id_user);
            const firstConnection = await AuthService.getInstance().getFirstConnection(userId[0].id_user);
            if (firstConnection.length === 1) {
                firstConnectionBool = true;
            }
            let response = {
                token: session,
                role: role[0].role,
                firstConnection: firstConnectionBool,
                userId: userId[0].id_user
            };
            res.send({
                response: response
            });
        } catch (err) {
            res.status(401).end(); // unauthorized
        }
    }

    async me(req: Request, res: Response) {
        try {
            res.json(req.user);
        } catch (err) {
            res.json(null);
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/login', express.json(), this.logUser.bind(this));
        router.get('/me', checkUserConnected(), this.me.bind(this));
        return router;
    }
}
