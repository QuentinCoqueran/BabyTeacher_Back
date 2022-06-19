import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";


export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().subscribeUser({
                login: req.body.login,
                password: req.body.password,
                lastname: req.body.lastname,
                name: req.body.name,
                role: req.body.role,
                age: req.body.age,
                sexe: req.body.sexe,
                email: req.body.email,
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
            const user = await AuthService.getInstance().getUserByToken(session);
            const role = await AuthService.getInstance().getRoleByUserId(user[0].id_user);
            const firstConnection = await AuthService.getInstance().getFirstConnection(user[0].id_user);
            if (firstConnection.length === 1) {
                firstConnectionBool = true;
            }
            let response = {
                token: session,
                role: role[0].role,
                firstConnection: firstConnectionBool,
                login: role[0].login,
            };
            res.send({
                response: response
            });
        } catch (err) {
            console.log(err)
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

    async getRoleByUserId(req: Request, res: Response) {
        try {
            console.log(req.params)
            if (req.params) {
                const role = await AuthService.getInstance().getRoleByUserId(req.params.id_user);
                res.json(role);
            } else {
                res.json(null);
            }
        } catch (err) {
            res.json(null);
        }
    }

    async updateBabysitter(req: Request, res: Response) {
        try {
            await AuthService.getInstance().updateBabysitter({
                id: req.body.id,
                photo: req.body.photo,
                description: req.body.description,
            });
            if (req.body.arraySkill[0].category != '' && req.body.arraySkill[0].skill != '') {
                await AuthService.getInstance().updateSkillsBabysitter({
                    id: req.body.id,
                    arraySkills: req.body.arraySkill
                });
                res.send({
                    response: true
                });
            }
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            await AuthService.getInstance().updateUser({
                id: req.body.id,
                sexe: req.body.sexe,
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                description: req.body.description,
                age: req.body.age,
            });
            res.send({
                response: true
            });
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async getUserLogin(req: Request, res: Response) {
        try {
            let user = await AuthService.getInstance().getUserByLogin(req.params.login);
            res.json(user[0]);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/updateBabysitter', express.json(), this.updateBabysitter.bind(this));
        router.post('/updateUser', express.json(), this.updateUser.bind(this));
        router.post('/login', express.json(), this.logUser.bind(this));
        router.get('/me', checkUserConnected(), this.me.bind(this));
        router.get('/getRoleByUserId/:id_user', this.getRoleByUserId.bind(this));
        router.get('/getUserLogin/:login', express.json(), this.getUserLogin.bind(this));
        return router;
    }
}
