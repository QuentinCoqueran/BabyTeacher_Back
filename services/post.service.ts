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
                if(error){
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
        let sqlQuery = `INSERT INTO posts (idUser, city, activityZone, hourlyWage, description, ageChild, numberChild) VALUES (${post.idUser}, '${post.city}', '${post.activityZone}', ${post.hourlyWage}, '${post.description}', ${post.ageChild}, ${post.numberChild})`
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
            const type = "parent";
            const sqlQuery = `INSERT INTO posts (idUser, city, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.city}', ${post.hourlyWage}, '${post.description}', ${post.ageChild}, ${post.numberChild}, '${type}')`;
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
            const type = "babyteacher";
            const sqlQuery = `INSERT INTO posts (idUser, activityZone, hourlyWage, description, type) VALUES (${post.idUser}, '${post.activityZone}', ${post.hourlyWage}, '${post.description}', '${type}')`;
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
}