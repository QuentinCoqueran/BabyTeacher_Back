import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {PostProps} from "../models";

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

    public async getAll(){
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

    public async getById(id: number){
        let sqlQuery = `SELECT * FROM posts WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUser(userId: number){
        let sqlQuery = `SELECT * FROM posts WHERE posts.idUser LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(post: PostProps){
        let sqlQuery = `INSERT INTO posts (idUser, city, activityZone, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.city}', '${post.activityZone}', ${post.hourlyWage}, '${post.description}', ${post.ageChild}, ${post.numberChild}, ${post.type})`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async createParentPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = { response: false, type: "Ok" };
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
            }catch (error) {
                errorObj = {response: true, type: "Erreur d'ajout du post"}
                return errorObj;
            }
        }
    }

    public async createBabyTeacherPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = { response: false, type: "Ok" };
        if (!post.idUser || !post.activityZone || !post.hourlyWage || !post.description ) {
            throw new Error("Data missed");
        } else {
            const description = post.description.replace(/'/g, "\\'");
            const type = "babysitter";
            const sqlQuery = `INSERT INTO posts (idUser, activityZone, hourlyWage, description, type) VALUES (${post.idUser}, '${post.activityZone}', ${post.hourlyWage}, '${description}', '${type}')`;
            try {
                await this.insertPromise(sqlQuery);
                return errorObj;
            }catch (error) {
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
        let errorObj = { response: false, type: "Ok" };
        if (!update.city && !update.hourlyWage && !update.description && !update.ageChild && !update.numberChild) {
            throw new Error("No data");
        } else {
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            }else {
                // TODO refactor this
                if(update.city !== undefined){
                    post[0].city = update.city;
                }
                if(update.hourlyWage !== undefined){
                    post[0].hourlyWage = update.hourlyWage;
                }
                if(update.description !== undefined){
                    const description = update.description.replace(/'/g, "\\'");
                    post[0].description = description;
                }
                if(update.ageChild !== undefined){
                    post[0].ageChild = update.ageChild;
                }
                if(update.numberChild !== undefined){
                    post[0].numberChild = update.numberChild;
                }
                const sqlQuery = `UPDATE posts SET city = '${post[0].city}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}', ageChild = ${post[0].ageChild}, numberChild = ${post[0].numberChild} WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                }catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }

    async updateBabysitterById(id: number, update: Partial<PostProps>) {
        let errorObj = { response: false, type: "Ok" };
        if (!update.idUser && !update.activityZone && !update.hourlyWage && !update.description) {
            throw new Error("No data");
        } else {
            if (update.description) {
                const description = update.description.replace(/'/g, "\\'");
            }
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            }else {
                // TODO refactor this
                if(update.activityZone !== undefined){
                    post[0].activityZone = update.activityZone;
                }
                if(update.hourlyWage !== undefined){
                    post[0].hourlyWage = update.hourlyWage;
                }
                if(update.description !== undefined){
                    post[0].description = update.description.replace(/'/g, "\\'");
                }
                const sqlQuery = `UPDATE posts SET activityZone = '${post[0].activityZone}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}' WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                }catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }
}