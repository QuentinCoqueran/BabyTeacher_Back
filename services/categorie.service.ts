import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {CategorieProps} from "../models/CategorieProps.model";

export class CategorieService {

    private static instance?: CategorieService;

    public static getInstance(): CategorieService {
        if (CategorieService.instance === undefined) {
            CategorieService.instance = new CategorieService();
        }
        return CategorieService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM categories";
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
        let sqlQuery = `SELECT * FROM categories WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(categorie: CategorieProps){
        let sqlQuery = `INSERT INTO categories (name) VALUES ('${categorie.name}')`
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