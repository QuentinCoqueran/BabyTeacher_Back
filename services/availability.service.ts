import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils";
import {AvailabilityProps} from "../models";
import {RoleService} from "./role.service";
import {AuthService} from "./auth.service";

export class AvailabilityService {

    private static instance?: AvailabilityService;

    public static getInstance(): AvailabilityService {
        if (AvailabilityService.instance === undefined) {
            AvailabilityService.instance = new AvailabilityService();
        }
        return AvailabilityService.instance;
    }

    private constructor() {
    }

    public async getAll(){
        let sqlQuery: string = "SELECT * FROM availability";
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
        let sqlQuery = `SELECT * FROM availability WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUserId(userId: number){
        let sqlQuery = `SELECT * FROM availability WHERE availability.idUser LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByPostId(postId: number){
        let sqlQuery = `SELECT * FROM availability WHERE availability.idPost LIKE ${postId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(availability: AvailabilityProps){

        if(!availability.idUser && !availability.idPost){
            return Promise.reject("You must provide an idUser or idPost");
        }

        if(availability.idUser && availability.idPost) {
            let idUser = availability.idUser;
            let role;

            role = await AuthService.getInstance().getRoleByUserId(idUser.toString());

            if(role[0].role === "parent"){
                return Promise.reject("Parent can't add availability on their profile");
            }

            let idPost = availability.idPost;
            let exist = await this.getByPostId(idPost);

            if(exist){
                return Promise.reject("Availability already exist for this post");
            }

        }



        let sqlQuery = `INSERT INTO availability (idUser, idPost, day, startHour, endHour) VALUES (${availability.idUser}, ${availability.idPost}, '${availability.day}', '${availability.startHour}', '${availability.endHour}')`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if(error){
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async update(availability: AvailabilityProps){


        if(availability.idUser && availability.idPost) {
            let idUser = availability.idUser;
            let role;

            role = await AuthService.getInstance().getRoleByUserId(idUser.toString());

            if(role[0].role === "parent"){
                return Promise.reject("Parent can't add availability on their profile");
            }

            let idPost = availability.idPost;
            let exist = await this.getByPostId(idPost);

            let cpt = 0;
            while(exist[cpt]){
                if(exist[cpt].id === availability.id){
                    cpt++;
                }else{
                    return Promise.reject("Availability already exist for this post");
                }
            }
        }


        let sqlQuery = `UPDATE availability SET idUser = ${availability.idUser}, idPost = ${availability.idPost}, day = '${availability.day}', startHour = '${availability.startHour}', endHour = '${availability.endHour}' WHERE id = ${availability.id}`
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
        let sqlQuery = `DELETE FROM availability WHERE id = ${id}`
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