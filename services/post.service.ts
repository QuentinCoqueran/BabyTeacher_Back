import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {PostProps} from "../models";
import {AuthService} from "./auth.service";
import {AvailabilityService} from "./availability.service";
import {type} from "os";

export class PostService {

    private static instance?: PostService;

    public static getInstance(): PostService {
        if (PostService.instance === undefined) {
            PostService.instance = new PostService();
        }
        return PostService.instance;
    }

    private constructor() {
    }

    public async getAll() {
        let sqlQuery: string = "SELECT * FROM posts";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getById(id: number) {
        let sqlQuery = `SELECT * FROM posts WHERE id LIKE ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    public async getByUser(userId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idUser LIKE ${userId}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    public async add(post: PostProps) {
        let sqlQuery = `INSERT INTO posts (idUser, city, activityZone, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.city}', '${post.activityZone}', ${post.hourlyWage}, '${post.description}', ${post.ageChild}, ${post.numberChild}, ${post.type})`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async createParentPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: "Ok"};
        if (!post.idUser || !post.city || !post.hourlyWage || !post.description || !post.ageChild || !post.numberChild) {
            throw new Error("Data missed");
        } else {
            // check if description contains "'" and put "\" before
            const description = post.description.replace(/'/g, "\\'");
            const type = "parent";
            const sqlQuery = `INSERT INTO posts (idUser, city, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.city}', ${post.hourlyWage}, '${description}', ${post.ageChild}, ${post.numberChild}, '${type}')`;
            try {
                await this.insertPromise(sqlQuery);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur d'ajout du post"}
                return errorObj;
            }
        }
    }

    public async createBabyTeacherPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: "Ok"};
        if (!post.idUser || !post.activityZone || !post.hourlyWage || !post.description) {
            throw new Error("Data missed");
        } else {
            const description = post.description.replace(/'/g, "\\'");
            const type = "babysitter";
            const sqlQuery = `INSERT INTO posts (idUser, activityZone, hourlyWage, description, type) VALUES (${post.idUser}, '${post.activityZone}', ${post.hourlyWage}, '${description}', '${type}')`;
            try {
                await this.insertPromise(sqlQuery);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur d'ajout du post"}
                return errorObj;
            }
        }
    }

    insertPromise = (sql: string) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    async updateParentById(id: number, update: Partial<PostProps>) {
        let errorObj = {response: false, type: "Ok"};
        if (!update.city && !update.hourlyWage && !update.description && !update.ageChild && !update.numberChild) {
            throw new Error("No data");
        } else {
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            } else {
                // TODO refactor this
                if (update.city !== undefined) {
                    post[0].city = update.city;
                }
                if (update.hourlyWage !== undefined) {
                    post[0].hourlyWage = update.hourlyWage;
                }
                if (update.description !== undefined) {
                    const description = update.description.replace(/'/g, "\\'");
                    post[0].description = description;
                }
                if (update.ageChild !== undefined) {
                    post[0].ageChild = update.ageChild;
                }
                if (update.numberChild !== undefined) {
                    post[0].numberChild = update.numberChild;
                }
                const sqlQuery = `UPDATE posts SET city = '${post[0].city}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}', ageChild = ${post[0].ageChild}, numberChild = ${post[0].numberChild} WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                } catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }

    async updateBabysitterById(id: number, update: Partial<PostProps>) {
        let errorObj = {response: false, type: "Ok"};
        if (!update.idUser && !update.activityZone && !update.hourlyWage && !update.description) {
            throw new Error("No data");
        } else {
            if (update.description) {
                const description = update.description.replace(/'/g, "\\'");
            }
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            } else {
                // TODO refactor this
                if (update.activityZone !== undefined) {
                    post[0].activityZone = update.activityZone;
                }
                if (update.hourlyWage !== undefined) {
                    post[0].hourlyWage = update.hourlyWage;
                }
                if (update.description !== undefined) {
                    post[0].description = update.description.replace(/'/g, "\\'");
                }
                const sqlQuery = `UPDATE posts SET activityZone = '${post[0].activityZone}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}' WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                } catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }

    async deleteById(id: number) {
        let sqlQuery = `DELETE FROM posts WHERE posts.id LIKE ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    async getByCategory(categorieId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idCategory LIKE ${categorieId}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        let users = await AuthService.getInstance().getUsersByCategoryId(categorieId);
        for (let i = 0; i < posts.length; i++) {
            let user = await AuthService.getInstance().getUserById(posts[i].idUser);
            if (!users.includes(user[0])) {
                posts.splice(i, 1);
                i--;
            }
        }
        return posts;
    }

    async getBySkill(skillId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idSkill LIKE ${skillId}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));

        let users = await AuthService.getInstance().getUsersBySkillId(skillId);

        for (let i = 0; i < posts.length; i++) {
            let user = await AuthService.getInstance().getUserById(posts[i].idUser);
            if (!users.includes(user[0])) {
                posts.splice(i, 1);
                i--;
            }
        }

        return posts;

    }

    async searchPost(param: { activityZone: any; skill: any; availability: any; category: any, role: string }) {
        let posts = [];
        let postsByactivityZone = [];
        let postByAvailabilityParent = [];
        let postByAvailabilitBabysitter = [];
        let currentPosts: RowDataPacket[] = [];
        let last: RowDataPacket[] = [];
        let postBySkilCategory = [];
        let postBySkills = [];
        if (param.role === 'babysitter') {
            for (let i = 0; i < param.activityZone.length; i++) {
                //get all posts by activityZone
                let result = await this.getByCityCode(param.activityZone[i]);
                posts.push(result)
            }
        }
        if (param.role === 'parent') {
            for (let i = 0; i < param.activityZone.length; i++) {
                //get all posts by activityZone
                let result = await this.getByActivityZone(param.activityZone[i]);
                posts.push(result)
            }
        }
        for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < posts[i].length; j++) {
                postsByactivityZone.push(posts[i][j]);
            }
        }
        //si pas de post par activityZone et role return null
        if (postsByactivityZone.length <= 0) {
            return null;
        }
        //get posts by availability
        if (param.role === "parent") {
            //liste de index a supprimer
            for (let i = 0; i < postsByactivityZone.length; i++) {
                let checkPostAvailability: boolean = false;
                let userAvaibality = await AvailabilityService.getInstance().getByUserId(postsByactivityZone[i].idUser);
                if (userAvaibality !== null) {
                    for (let j = 0; j < userAvaibality.length; j++) {
                        if (param.availability.includes(userAvaibality[j].day)) {
                            checkPostAvailability = true;
                        }
                    }
                }
                if (checkPostAvailability) {
                    postByAvailabilityParent.push(postsByactivityZone[i]);
                }
            }
        }
        if (param.role === "babysitter") {
            //liste de index a supprimer
            for (let i = 0; i < postsByactivityZone.length; i++) {
                let checkPostAvailability: boolean = false;
                let postAvaibality = await AvailabilityService.getInstance().getByPostId(postsByactivityZone[i].idPost);
                if (postAvaibality !== null) {
                    for (let j = 0; j < postAvaibality.length; j++) {
                        if (param.availability.includes(postAvaibality[j].day)) {
                            checkPostAvailability = true;
                        }
                    }
                }
                if (checkPostAvailability) {
                    postByAvailabilitBabysitter.push(postsByactivityZone[i]);
                }
            }
        }
        if (param.role === "babysitter") {
            currentPosts = postByAvailabilitBabysitter;
        }
        if (param.role === "parent") {
            currentPosts = postByAvailabilityParent;
        }
        for (let i = 0; i < currentPosts.length; i++) {
            for (let j = 0; j < param.skill.length; j++) {
                let result = await this.getPostBySkillById(currentPosts[i].idPost, param.skill[j])
                postBySkills.push(result);
            }
        }
        for (let i = 0; i < currentPosts.length; i++) {
            for (let j = 0; j < param.category.length; j++) {
                let result = await this.getPostByCategoryById(currentPosts[i].idPost, param.category[j])
                postBySkilCategory.push(result);
            }
        }

        // 100% de correspondance
        this.pushInArray(postBySkills, last);
        // 75% de correspondance
        this.pushInArray(postBySkilCategory, last);
        // 50% de correspondance
        this.pushInArray(currentPosts, last);
        // 25% de correspondance
        this.pushInArray(postsByactivityZone, last);
        // 25 % de correspondance
        if (param.role === "babysitter") {
            this.pushInArray(postByAvailabilitBabysitter, last);
        }
        if (param.role === "parent") {
            this.pushInArray(postByAvailabilityParent, last);
        }
        return last;
    }

    pushInArray(current: any[], last: RowDataPacket[]) {
        if (current[0].idPost === undefined) {
            current = current[0];
        }
        if (current.length > 0) {
            for (let i = 0; i < current.length; i++) {
                let checkPost: boolean = true;
                if (current[i].id || current[i].idPost) {
                    if (last.includes(current[i].id) || last.includes(current[i].idPost)) {
                        checkPost = false;
                    }
                    if (checkPost) {
                        if (current[i].idPost) {
                            last.push(current[i].idPost);
                        } else {
                            last.push(current[i].id);
                        }
                    }
                }
            }
        }
        return last;
    }

    async getPostBySkillById(id: number, name: string) {
        let sqlQuery = `select posts.id from posts inner join skills ON posts.id = skills.idPost WHERE skills.name = '${name}' AND skills.idPost = ${id}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

    async getPostByCategoryById(id: number, name: string) {
        let sqlQuery = `select posts.id from posts 
        inner join skills ON posts.id = skills.idPost
        inner join categories ON skills.idCategorie = categories.id
        WHERE skills.idPost = ${id} and categories.name = '${name}'`;
        let postsCategory = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return postsCategory;
    }

    private async getByCityCode(code: number) {
        let sqlQuery = "SELECT max(posts.id) as idPost,idUser,`city-code`,hourlyWage,description,ageChild,numberChild,type FROM posts WHERE `city-code` LIKE '" + code + "%' GROUP BY idUser";
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

    private async getByActivityZone(code: string) {
        let sqlQuery = 'select max(posts.id) as idPost,idUser,`city-code`,hourlyWage,description,ageChild,numberChild,type, activityzone.codeDep from posts INNER JOIN activityzone ON posts.id = activityzone.id_post  where activityzone.codeDep = ' + code + ' GROUP BY idUser'
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

}