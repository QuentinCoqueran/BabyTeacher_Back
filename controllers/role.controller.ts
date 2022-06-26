import {RoleService} from "../services";
import express, {Request, Response} from "express";

export class RoleController {
    async getAll(req: Request, res: Response) {
        try {
            const roles = await RoleService.getInstance().getAll();
            res.send({
                response: roles
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let role;
        try {
            if (req.query.id) {
                role = await RoleService.getInstance().getById(parseInt(<string>req.query.id));
            }
            if (role) {
                res.send({
                    response: role
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createRole(req: Request, res: Response) {
        try {
            const role = await RoleService.getInstance().add({
                role: req.body.role
            });
            if (role) {
                res.send({
                    response: role
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateRole(req: Request, res: Response) {
        try {
            const role = await RoleService.getInstance().update({
                id: parseInt(<string>req.query.id),
                role: req.body.role
            });
            if (role) {
                res.send({
                    response: role
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteRole(req: Request, res: Response) {
        try {
            const role = await RoleService.getInstance().delete(parseInt(<string>req.query.id));
            if (role) {
                res.send({
                    response: role
                });
            }else {
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
        router.post('/create', express.json(), this.createRole.bind(this));
        router.put('/edit/:id', express.json(), this.updateRole.bind(this));
        router.delete('/delete/:id', express.json(), this.deleteRole.bind(this));
        return router;
    }

}