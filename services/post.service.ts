import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {PostProps} from "../models/PostProps.model";

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

}