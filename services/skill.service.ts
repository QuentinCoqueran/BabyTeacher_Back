import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {SkillProps} from "../models/SkillProps.model";

export class SkillService {

    private static instance?: SkillService;

    public static getInstance(): SkillService {
        if (SkillService.instance === undefined) {
            SkillService.instance = new SkillService();
        }
        return SkillService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM skills";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public getById(id: number){
        let sqlQuery = `SELECT * FROM skills WHERE id LIKE ${id}`
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
        let sqlQuery = `SELECT * FROM skills WHERE idUser LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByCategorie(categorieId: string){
        let sqlQuery = `SELECT * FROM skills WHERE idCategorie LIKE '${categorieId}'`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(skill: SkillProps){
        let sqlQuery = `INSERT INTO skills (idUser, idCategorie, name, description) VALUES (${skill.idUser}, '${skill.idCategorie}', '${skill.name}', '${skill.description}')`
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