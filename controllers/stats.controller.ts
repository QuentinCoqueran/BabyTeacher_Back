import {StatsService} from "../services/stats.service";
import express, {Request, Response} from "express";
import {checkUserConnected} from "../middlewares";

export class StatsController {

    public async getUserCount(req: Request, res: Response) {
        try {
            const count = await StatsService.getInstance().getUserCount();
            if (count) {
                res.send({
                    response: count
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    buildRoutes() {
        const router = express.Router();
        router.get('/userCount', this.getUserCount.bind(this));
        return router;
    }
}