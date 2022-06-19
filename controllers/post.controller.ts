import express, {Request, Response, Router} from "express";
import {AuthService} from "../services";
import {checkUserConnected} from "../middlewares";
import {PostService} from "../services";

export class PostController{

    async createPost(req: Request, res: Response){
        try{
            if(req.user !== undefined) {
                const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
                if(role[0].role === "parent"){
                    const post = await PostService.getInstance().createParentPost({
                        idUser: req.user.id,
                        city: req.body.city,
                        hourlyWage: req.body.hourlyWage,
                        description: req.body.description,
                        ageChild: req.body.ageChild,
                        numberChild: req.body.numberChild
                    });
                    res.send({
                        response: post
                    });
                }
                else{
                    const post = await PostService.getInstance().createBabyTeacherPost({
                        idUser: req.user.id,
                        activityZone: req.body.activityZone,
                        hourlyWage: req.body.hourlyWage,
                        description: req.body.description,
                    });
                    res.send({
                        response: post
                    });
                }
            }
        }catch(err){
            console.log(err);
            res.status(400).json(err);
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', checkUserConnected(), express.json(), this.createPost.bind(this));
        // router.post('/update', express.json(), this.updatePost.bind(this));
        // router.get('/show/:id', checkUserConnected(), this.show.bind(this));
        return router;
    }
}