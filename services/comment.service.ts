import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {CommentProps} from "../models/CommentProps.model";

export class CommentService {

    private static instance?: CommentService;

    public static getInstance(): CommentService {
        if (CommentService.instance === undefined) {
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM comments";
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
        let sqlQuery = `SELECT * FROM comments WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUserComment(userId: number){
        let sqlQuery = `SELECT * FROM comments WHERE comments.idUserComment LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByProfile(profileId: number){
        let sqlQuery = `SELECT * FROM comments WHERE comments.idProfile LIKE ${profileId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(comment: CommentProps){
        let sqlQuery = `INSERT INTO comments (idProfile, idUserComment, date, content, note) VALUES (${comment.idProfile}, ${comment.idUserComment}, '${comment.date}', '${comment.content}', ${comment.note})`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async update(comment: CommentProps){
        let sqlQuery = `UPDATE comments SET idProfile = ${comment.idProfile}, idUserComment = ${comment.idUserComment}, date = '${comment.date}', content = '${comment.content}', note = ${comment.note} WHERE id = ${comment.id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async delete(id: number){
        let sqlQuery = `DELETE FROM comments WHERE id = ${id}`
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