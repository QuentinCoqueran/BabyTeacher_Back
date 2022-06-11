import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";

export class SignalementService {

    private static instance?: SignalementService;

    public static getInstance(): SignalementService {
        if (SignalementService.instance === undefined) {
            SignalementService.instance = new SignalementService();
        }
        return SignalementService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM signalements";
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
        let sqlQuery = `SELECT * FROM signalements WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByProfileId(profileId: number){
        let sqlQuery = `SELECT * FROM signalements WHERE signalements.idProfile LIKE ${profileId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getBySignalerId(signalerId: number){
        let sqlQuery = `SELECT * FROM signalements WHERE signalements.idSignaler LIKE ${signalerId}`
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