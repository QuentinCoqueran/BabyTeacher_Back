import express, {Request, Response} from "express";
import {SignalementService} from "../services";

export class SignalementController{

    async getAll(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getAll();
            res.send({
                response: signalements
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let signalement;
        try {
            if (req.query.id) {
                signalement = await SignalementService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSignalementByProfile(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getByProfileId(parseInt(<string>req.params.idProfile));
            if (signalements) {
                res.send({
                    response: signalements
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSignalementBySignaler(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getBySignalerId(parseInt(<string>req.params.idSignaler));
            if (signalements) {
                res.send({
                    response: signalements
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().add({
                idProfile: req.body.idProfile,
                idSignaler: req.body.idSignaler,
                dateTime: req.body.dateTime,
                reason: req.body.reason
            });
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idProfile: req.body.idProfile,
                idSignaler: req.body.idSignaler,
                dateTime: req.body.dateTime,
                reason: req.body.reason
            });
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().delete(parseInt(<string>req.params.id));
            if (signalement) {
                res.send({
                    response: signalement
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
        router.get('/getByProfile/:idProfile', this.getSignalementByProfile.bind(this));
        router.get('/getBySignaler/:idSignaler', this.getSignalementBySignaler.bind(this));
        router.post('/create', express.json(), this.createSignalement.bind(this));
        router.put('/edit/:id', express.json(), this.updateSignalement.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteSignalement.bind(this));
        return router;
    }

}