import express, {Request, Response} from "express";
import {SessionService} from "../services";

export class SessionController {
    async getAll(req: Request, res: Response) {
        try {
            const sessions = await SessionService.getInstance().getAll();
            res.send({
                response: sessions
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let session;
        try {
            if (req.query.id) {
                session = await SessionService.getInstance().getById(parseInt(<string>req.query.id));
            }
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().add({
                expirationDate: req.body.expirationDate,
                createdAt: req.body.createdAt,
                id_user: req.body.id_user,
                token: req.body.token
            });
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().update({
                id: parseInt(<string>req.query.id),
                expirationDate: req.body.expirationDate,
                createdAt: req.body.createdAt,
                id_user: req.body.id_user,
                token: req.body.token
            });
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().delete(parseInt(<string>req.query.id));
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes() {
        const router = express.Router();
        router.get('/all', this.getAll.bind(this));
        router.get('/:id', this.getById.bind(this));
        router.post('/create', express.json(), this.createSession.bind(this));
        router.put('/edit/:id', express.json(), this.updateSession.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteSession.bind(this));
        return router;
    }

}
