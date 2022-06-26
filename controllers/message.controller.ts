import express, {Request, Response, Router} from "express";
import {MessageService} from "../services";

export class MessageController {

    async getAll(req: Request, res: Response) {
        try {
            const messages = await MessageService.getInstance().getAll();
            res.send({
                response: messages
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let message;
        try {
            if (req.query.id) {
                message = await MessageService.getInstance().getById(parseInt(<string>req.query.id));
            }
            if (message) {
                res.send({
                    response: message
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createMessage(req: Request, res: Response) {
        try {
            const message = await MessageService.getInstance().add({
                idSender: req.body.idSender,
                idReceiver: req.body.idReceiver,
                content: req.body.content,
                sendAt: req.body.sendAt,
                readAt: req.body.readAt
            });
            if (message) {
                res.send({
                    response: message
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateMessage(req: Request, res: Response) {
        try {
            const message = await MessageService.getInstance().update( {
                id: parseInt(<string>req.params.id),
                idSender: req.body.idSender,
                idReceiver: req.body.idReceiver,
                content: req.body.content,
                sendAt: req.body.sendAt,
                readAt: req.body.readAt
            });
            if (message) {
                res.send({
                    response: message
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteMessage(req: Request, res: Response) {
        try {
            const message = await MessageService.getInstance().delete(parseInt(<string>req.params.id));
            if (message) {
                res.send({
                    response: message
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', this.getAll.bind(this));
        router.get('/:id', this.getById.bind(this));
        router.post('/create', express.json(), this.createMessage.bind(this));
        router.put('/update/:id', express.json(), this.updateMessage.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteMessage.bind(this));
        return router;
    }

}