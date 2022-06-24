import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {ContractProps} from "../models/ContractProps.model";

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

    public async add(contract: ContractProps){
        let sqlQuery = `INSERT INTO contracts (idParent, idBabysitter, validateAt, numberOfHours, hourlyWage, qrCode, numberOfSitting, numberOfAttendance, startDate, endDate) VALUES (${contract.idParent}, ${contract.idBabysitter}, '${contract.validateAt}', ${contract.numberOfHours}, ${contract.hourlyWage}, '${contract.qrCode}', ${contract.numberOfSitting}, ${contract.numberOfAttendance}, '${contract.startDate}', '${contract.endDate}')`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async update(contract: ContractProps){
        let sqlQuery = `UPDATE contracts SET idParent = ${contract.idParent}, idBabysitter = ${contract.idBabysitter}, validateAt = '${contract.validateAt}', numberOfHours = ${contract.numberOfHours}, hourlyWage = ${contract.hourlyWage}, qrCode = '${contract.qrCode}', numberOfSitting = ${contract.numberOfSitting}, numberOfAttendance = ${contract.numberOfAttendance}, startDate = '${contract.startDate}', endDate = '${contract.endDate}' WHERE id = ${contract.id}`
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
        let sqlQuery = `DELETE FROM contracts WHERE id = ${id}`
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