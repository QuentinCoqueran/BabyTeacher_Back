import express, {Request, Response, Router} from "express";
import {AvailabilityService} from "../services";

export class AvailabilityController {

    async getAll(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getAll();
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityById(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().getById(parseInt(<string>req.params.id));
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityByUserId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getByUserId(parseInt(<string>req.params.idUser));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityParseByUserId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().parseAvailability(parseInt(<string>req.params.idUser));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityByPostId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getByPostId(parseInt(<string>req.params.idPost));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createAvailability(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().add({
                idUser: req.body.idUser,
                idPost: req.body.idPost,
                day: req.body.day,
                startHour: req.body.startHour,
                endHour: req.body.endHour
            });
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateAvailability(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idUser: req.body.idUser,
                idPost: req.body.idPost,
                day: req.body.day,
                startHour: req.body.startHour,
                endHour: req.body.endHour
            });
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteAvailability(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().delete(parseInt(<string>req.params.id));
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
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
        router.get('/:id', this.getAvailabilityById.bind(this));
        router.get('/getByUser/:idUser', this.getAvailabilityByUserId.bind(this));
        router.get('/getByPost/:idPost', this.getAvailabilityByPostId.bind(this));
        router.get('/getAvailabilityParseByUserId/:idUser', this.getAvailabilityParseByUserId.bind(this));
        router.post('/create', express.json(), this.createAvailability.bind(this));
        router.put('/update/:id', express.json(), this.updateAvailability.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteAvailability.bind(this));
        return router;
    }

}