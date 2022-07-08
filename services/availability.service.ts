import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils";
import {AvailabilityProps, Calendar, ListCalendar} from "../models";
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

    insertPromise = (sql: string) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    public async getAll() {
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

    public async getById(id: number) {
        let sqlQuery = `SELECT * FROM availability WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUserId(userId: number) {
        let sqlQuery = `SELECT * FROM availability WHERE availability.idUser LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async parseAvailability(idUser: number) {
        let availabilityList = await AvailabilityService.getInstance().getByUserId(idUser);

        let listCalendat: ListCalendar = new ListCalendar([]);
        for (let i = 0; i < 24; i++) {
            let calendar: Calendar = new Calendar("", "", "", "", "", "", "");
            for (let availability of availabilityList) {
                if (i >= availability.startHour && i <= availability.endHour) {
                    switch (availability.day) {
                        case "lundi":
                            calendar.lundi = "X"
                            break;
                        case "mardi":
                            calendar.mardi = "X"
                            break;
                        case "mercredi":
                            calendar.mercredi = "X"
                            break;
                        case "jeudi":
                            calendar.jeudi = "X"
                            break;
                        case "vendredi":
                            calendar.vendredi = "X"
                            break;
                        case "samedi":
                            calendar.samedi = "X"
                            break;
                        case "dimanche":
                            calendar.dimanche = "X"
                            break;
                    }
                }
            }

            listCalendat.listCalendar.push(calendar);
        }
        return listCalendat;
    }

    public async getByPostId(postId: number) {
        let sqlQuery = `SELECT * FROM availability WHERE availability.idPost LIKE ${postId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(availability: AvailabilityProps) {

        if (!availability.idUser && !availability.idPost) {
            return Promise.reject("You must provide an idUser or idPost");
        }

        if (availability.idUser && availability.idPost) {
            let idUser = availability.idUser;
            let role;

            role = await AuthService.getInstance().getRoleByUserId(idUser.toString());

            if (role[0].role === "parent") {
                return Promise.reject("Parent can't add availability on their profile");
            }

            let idPost = availability.idPost;
            let exist = await this.getByPostId(idPost);

            if (exist) {
                return Promise.reject("Availability already exist for this post");
            }

        }


        let sqlQuery = `INSERT INTO availability (idUser, idPost, day, startHour, endHour) VALUES (${availability.idUser}, ${availability.idPost}, '${availability.day}', '${availability.startHour}', '${availability.endHour}')`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    async updateListAvailabilityBabysitter(param: { arrayAvaibality: any, idUser: number }) {
        let arrayAvaibality = param.arrayAvaibality; //Ce que je reçois

        let sqlQueries = [];
        let userAvailability = await this.getByUserId(param.idUser);
        let exist = false;
        for (let avToAdd of arrayAvaibality){

            for (let availability of userAvailability) {
                if (avToAdd.day === availability.day) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                sqlQueries.push(`UPDATE availability SET startHour = '${avToAdd.startHour}', endHour = '${avToAdd.endHour}' WHERE idUser = ${param.idUser} AND day = '${avToAdd.day}'`);
            }else{
                break;
            }
        }

        if (!exist){
            for (let sql of sqlQueries) {
                await this.insertPromise(sql);
            }
            return Promise.resolve("Availability updated");
        }else {
            return Promise.reject("One of the availability already exist (Rollback)");
        }
    }


    public async delete(id: number) {
        let sqlQuery = `DELETE FROM availability WHERE id = ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

}