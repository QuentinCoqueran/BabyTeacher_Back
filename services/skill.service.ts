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

    public async getAll() {
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

    public getById(id: number) {
        let sqlQuery = `SELECT * FROM skills WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUser(login: string) {
        let sqlQuery = `SELECT skills.name , skills.id, skills.certified, skills.detail, categories.name as test FROM skills
        INNER JOIN categories on skills.idCategorie = categories.id
        INNER JOIN users on skills.idUser = users.id
        where users.login = '${login}'`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUserId(id: string) {
        let sqlQuery = `SELECT skills.name , skills.id, skills.certified, skills.detail, categories.name as test FROM skills
        INNER JOIN categories on skills.idCategorie = categories.id
        INNER JOIN users on skills.idUser = users.id
        where users.id = '${id}'`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByPost(id: string) {
        let sqlQuery = `SELECT skills.name FROM skills where idPost = ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByCategorie(categorieId: number) {
        let sqlQuery = `SELECT * FROM skills WHERE idCategorie LIKE '${categorieId}'`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(skill: SkillProps) {
        let sqlQuery = `INSERT INTO skills (idUser, idCategorie, name) VALUES (${skill.idUser}, '${skill.idCategorie}', '${skill.name}')`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async update(skill: SkillProps) {
        let sqlQuery = `UPDATE skills SET idUser = ${skill.idUser}, idCategorie = '${skill.idCategorie}', name = '${skill.name}' WHERE id = ${skill.id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async delete(id: number) {
        let sqlQuery = `DELETE FROM skills WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    async addSkillPost(param: { name: string[]; idPost: number }) {
        if (param.name.length === 0) {
            return;
        }
        if (param.idPost === null) {
            return;
        }
        for (let i = 0; i < param.name.length; i++) {
            let sqlQuery = `INSERT INTO skills (idPost, name) VALUES (${param.idPost},  '${param.name[i]}')`
            return new Promise<RowDataPacket[]>(((resolve, reject) => {
                db.query(sqlQuery, (error: QueryError) => {
                    if (error) {
                        return reject(error)
                    }
                })
            }))
        }
    }
}