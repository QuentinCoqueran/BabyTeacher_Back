import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";
import {CategorieService} from "../services/categorie.service";
import {SkillService} from "../services/skill.service";


export class CategorieController {

    async getAll(req: Request, res: Response) {
        try {
            const categories = await CategorieService.getInstance().getAll();
            res.send({
                response: categories
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSkillByUser(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByUser(req.params.login);
            res.send({
                response: skills
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.get('/getAllCategories', this.getAll.bind(this));
        router.get('/getSkillsByUserLogin/:login', this.getSkillByUser.bind(this));
        return router;
    }
}

