import express, {Request, Response, Router} from "express";
import {AuthService, AvailabilityService, ActivtyZoneService} from "../services";
import {checkUserConnected} from "../middlewares";
 import {PostService} from "../services";

export class PostController {

    async deletePost(req: Request, res: Response) {
        const isExist = await PostService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                if(isExist[0].type === "parent") {
                    await AvailabilityService.getInstance().deleteAllByPostId(parseInt(req.params.id));
                } else {
                    await ActivtyZoneService.getInstance().deleteByPostId(parseInt(req.params.id));
                }
                const post = await PostService.getInstance().deleteById(parseInt(req.params.id));
                res.status(204).json(post);
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }

    async show(req: Request, res: Response) {
        const isExist = await PostService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                const post = await PostService.getInstance().getById(parseInt(req.params.id));
                res.json(post);
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }

    // async updatePost(req: Request, res: Response) {
    //     if (req.user !== undefined) {
    //         const isExists = await PostService.getInstance().getById(parseInt(req.params.id));
    //         const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
    //
    //         if (isExists) {
    //             if (role[0].role === "parent") {
    //                 try {
    //                     const post = await AvailabilityService.getInstance().updateParentPost({
    //                     const post = await PostService.getInstance().updateParentById(parseInt(req.params.id), req.body);
    //                     res.json(post);
    //                 } catch (err) {
    //                     console.log(err);
    //                     res.status(400).json(err);
    //                 }
    //             } else {
    //                 try {
    //                     const post = await PostService.getInstance().updateBabysitterById(parseInt(req.params.id), req.body);
    //                     res.json(post);
    //                 } catch (err) {
    //                     console.log(err);
    //                     res.status(400).json(err);
    //                 }
    //             }
    //         } else {
    //             console.log("This post id doesn't exists")
    //             res.sendStatus(404).end();
    //         }
    //     }
    // }

    async searchPost(req: Request, res: Response) {
        if (req.user !== undefined) {
            const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
            try {
                const post = await PostService.getInstance().searchPost({
                    activityZone: req.body.activityZone,
                    availability: req.body.availability,
                    skill: req.body.skill,
                    category: req.body.category,
                    role: role[0].role
                });
                res.json(post);
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        }
    }


    // async createPost(req: Request, res: Response) {
    //     try {
    //         if (req.user !== undefined) {
    //             const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
    //             if (role[0].role === "parent") {
    //                 const post = await PostService.getInstance().createParentPost({
    //                     idUser: req.user.id,
    //                     cityCode: req.body.city,
    //                     hourlyWage: req.body.hourlyWage,
    //                     description: req.body.description,
    //                     ageChild: req.body.ageChild,
    //                     numberChild: req.body.numberChild
    //                 });
    //                 res.send({
    //                     response: post
    //                 });
    //             } else {
    //                 const post = await PostService.getInstance().createBabyTeacherPost({
    //                     idUser: req.user.id,
    //                     activityZone: req.body.activityZone,
    //                     hourlyWage: req.body.hourlyWage,
    //                     description: req.body.description,
    //                 });
    //                 res.send({
    //                     response: post
    //                 });
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         res.status(400).json(err);
    //     }
    // }


    buildRoutes(): Router {
        const router = express.Router();
        // router.post('/add', checkUserConnected(), express.json(), this.createPost.bind(this));
        // router.post('/update/:id', express.json(), checkUserConnected(), this.updatePost.bind(this));
        router.post('/search-post', express.json(), checkUserConnected(), this.searchPost.bind(this));
        router.get('/get/:id', checkUserConnected(), this.show.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deletePost.bind(this));
        return router;
    }
}