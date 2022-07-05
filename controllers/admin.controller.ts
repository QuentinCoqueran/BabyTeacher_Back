import express, {Request, Response, Router} from "express";
import {AuthService, CategorieService, PostService, SkillService} from "../services";

export class AdminController {

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getAllUsers();
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().getUserById(parseInt(<string>req.params.id));
            if (user) {
                res.send({
                    response: user
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategorieService.getInstance().getAll();
            if (categories) {
                res.send({
                    response: categories
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getCategoryById(req: Request, res: Response) {
        try {
            const category = await CategorieService.getInstance().getById(parseInt(<string>req.params.id));
            if (category) {
                res.send({
                    response: category
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getUsersByCategoryId(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getUsersByCategoryId(parseInt(<string>req.params.id));
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getSkillsByCategoryId(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByCategorie(parseInt(<string>req.params.id));
            if (skills) {
                res.send({
                    response: skills
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getAllSkills(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getAll();
            if (skills) {
                res.send({
                    response: skills
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getSkillById(req: Request, res: Response) {
        try {
            const skill = await SkillService.getInstance().getById(parseInt(<string>req.params.id));
            if (skill) {
                res.send({
                    response: skill
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getUsersBySkillId(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getUsersBySkillId(parseInt(<string>req.params.id));
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getAll();
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getPostById(req: Request, res: Response) {
        try {
            const post = await PostService.getInstance().getById(parseInt(<string>req.params.id));
            if (post) {
                res.send({
                    response: post
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getPostsByUserId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getByUser(parseInt(<string>req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getPostsByCategoryId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getByCategory(parseInt(<string>req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async getPostsBySkillId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getBySkill(parseInt(<string>req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async deleteUserById(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().deleteUser(parseInt(<string>req.params.id));
            if (user) {
                res.send({
                    response: user
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async deletePostById(req: Request, res: Response) {
        try {
            const post = await PostService.getInstance().deleteById(parseInt(<string>req.params.id));
            if (post) {
                res.send({
                    response: post
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async deleteCategorieById(req: Request, res: Response) {
        try {
            const category = await CategorieService.getInstance().delete(parseInt(<string>req.params.id));
            if (category) {
                res.send({
                    response: category
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    public async deleteSkillById(req: Request, res: Response) {
        try {
            const skill = await SkillService.getInstance().delete(parseInt(<string>req.params.id));
            if (skill) {
                res.send({
                    response: skill
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
        router.get("/users", this.getAllUsers.bind(this));
        router.get("/users/:id", this.getUserById.bind(this));
        router.get("/users/categories/:id", this.getUsersByCategoryId.bind(this));
        router.get("/users/skills/:id", this.getUsersBySkillId.bind(this));
        router.get("/posts", this.getAllPosts.bind(this));
        router.get("/posts/:id", this.getPostById.bind(this));
        router.get("/post/user/:id", this.getPostsByUserId.bind(this));
        router.get("/posts/categories/:id", this.getPostsByCategoryId.bind(this));
        router.get("/posts/skills/:id", this.getPostsBySkillId.bind(this));
        router.get("/categories", this.getAllCategories.bind(this));
        router.get("/categories/:id", this.getCategoryById.bind(this));
        router.get("/skills", this.getAllSkills.bind(this));
        router.get("/skills/:id", this.getSkillById.bind(this));
        router.get("/skills/categories/:id", this.getSkillsByCategoryId.bind(this));

        router.delete("/users/delete/:id", this.deleteUserById.bind(this));
        router.delete("/posts/delete/:id", this.deletePostById.bind(this));
        router.delete("/categories/delete/:id", this.deleteCategorieById.bind(this));
        router.delete("/skills/delete/:id", this.deleteSkillById.bind(this));

        return router;
    }

}