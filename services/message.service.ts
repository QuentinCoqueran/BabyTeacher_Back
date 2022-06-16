import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {MessageProps} from "../models/MessageProps.model";

export class MessageService {

    private static instance?: MessageService;

    public static getInstance(): MessageService {
        if (MessageService.instance === undefined) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM messages";
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
        let sqlQuery = `SELECT * FROM messages WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getBySender(senderId: number){
        let sqlQuery = `SELECT * FROM messages WHERE messages.idSender LIKE ${senderId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByReceiver(receiverId: number){
        let sqlQuery = `SELECT * FROM messages WHERE messages.idReceiver LIKE ${receiverId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(message: MessageProps){
        let sqlQuery = `INSERT INTO messages (id, idSender, idReceiver, content, sendAt, readAt) VALUES (${message.id}, ${message.idSender}, ${message.idReceiver}, '${message.content}', '${message.sendAt}', '${message.readAt}')`
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