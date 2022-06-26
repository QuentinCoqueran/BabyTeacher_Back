import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";
import {CategorieService} from "../services/categorie.service";

import {SkillService} from "../services/skill.service";

import {CategorieProps} from "../models";



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

    async getById(req: Request, res: Response) {
        let categorie;
        try {
            if (req.query.id) {
                categorie = await CategorieService.getInstance().getById(parseInt(<string>req.query.id));
            }
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().add({
                name: req.body.name
            });
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().update({
                id: parseInt(<string>req.body.id),
                name: req.body.name
            });
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().delete(parseInt(<string>req.query.id));
            if (categorie) {
                res.send({
                    response: categorie
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
        router.get('/getSkillsByUserLogin/:login', this.getSkillByUser.bind(this));
        router.get('/:id',this.getById.bind(this));
        router.post('/create', express.json(), this.createCategorie.bind(this));
        router.put('/update/:id', express.json(), this.updateCategorie.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteCategorie.bind(this));

        return router;
    }
}

