import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";

export class ContractService {

    private static instance?: ContractService;

    public static getInstance(): ContractService {
        if (ContractService.instance === undefined) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM contracts";
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
        let sqlQuery = `SELECT * FROM contracts WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByParent(parentId: number){
        let sqlQuery = `SELECT * FROM contracts WHERE contracts.idParent LIKE ${parentId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByBabysitter(babysitterId: number){
        let sqlQuery = `SELECT * FROM contracts WHERE contracts.idBabysitter LIKE ${babysitterId}`
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