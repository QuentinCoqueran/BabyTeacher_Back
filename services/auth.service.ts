import {UserProps} from "../models/UserProps";
import {db} from "../utils/mysql.connector";
import {SecurityUtils} from "../utils/security.utils";
import {SessionProps} from "../models/SessionProps";
import Query from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import {QueryError, RowDataPacket} from "mysql2";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() {
    }

    // #TODO modifier et découper cette fonction !!!

    public async subscribeUser(user: Partial<UserProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: ""}

        if (((!user.name || !user.lastname || !user.password || !user.login || !user.email) && user.role === "parent") ||
            ((!user.name || !user.lastname || !user.password || !user.login || !user.age || !user.sexe || !user.email) && user.role === "babysitter")
            /*!user.photo || */  /*|| !user.description*/) {
            throw new Error("Data Missed");
        } else {
            if (user.age && parseInt(String(user.age)) < 16) {
                errorObj = {response: true, type: "Age minimum 16 ans"}
                return errorObj;
            }
            if (user.login && user.password) {
                const userByLogin = await this.getUserByLogin(user.login);
                console.log(userByLogin.length)
                if (userByLogin.length != 0) {
                    errorObj = {response: true, type: "Le pseudo existe déjà"}
                    return errorObj;
                }
            } else {
                throw new Error("Data Missed");
            }
            let passwordString = SecurityUtils.sha512(user.password);
            let nameString = user.name;
            let lastNameString = user.lastname;
            let loginString = user.login;
            let roleString = user.role;
            let ageString = user.age;
            let sexeNumber = parseInt(String(user.sexe));
            //let photoString = user.photo;
            let emailString = user.email;
            //let descriptionString = user.description;
            const sql = `INSERT INTO users (name, lastname,password,login,id_role,age,sexe,/*photo,*/email/*,description*/) VALUES ('${nameString}', '${lastNameString}','${passwordString}','${loginString}',
            (SELECT id FROM role WHERE role = '${roleString}'), '${ageString}', '${sexeNumber}', /*'$/*{photoString}',*/ '${emailString}'/*, '$/*{descriptionString}'*/)`;
            try {
                await this.insertPromise(sql);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur inscription"}
                return errorObj;
            }
        }
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

    public async logIn(data: Pick<UserProps, 'login' | 'password'>): Promise<string> {
        console.log(data)
        if (!data.login || !data.password) {
            throw new Error("Data Missed");
        }
        let login = data.login;
        let password = SecurityUtils.sha512(data.password);
        try {
            let resultQuery = await this.getUserByLoginPass(login, password);
            const user_id = resultQuery[0].id;
            if (resultQuery.length > 0) {
                let token = SecurityUtils.generateToken();
                let sql = "INSERT INTO sessions (token, id_user) VALUES ('" + token + "','" + user_id + "')";
                try {
                    await this.insertPromise(sql);
                    return token;
                } catch (error) {
                    console.log(error);
                    throw new Error("Error in insert session");
                }
            }
            throw new Error("User not found");
        } catch (error) {
            throw new Error("SQl error" + error);
        }
    }

    public async getUserByLogin(login: string) {
        const sql = `SELECT * FROM users WHERE login = '${login}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getUserByLoginPass(login: string, password: string) {
        const sql = `SELECT * FROM users WHERE login = '${login}' AND password = '${password}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getRoleByUserId(id: number) {
        const sql = `SELECT role.role FROM role INNER JOIN users on role.id = users.id_role where users.id =${id}`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getUserByToken(token: string) {
        const sql = `SELECT id_user FROM sessions WHERE token = '${token}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserById(userId: number) {
        const sql = `SELECT * FROM users WHERE id = '${userId}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserByEmail(email: string) {
        const sql = `SELECT * FROM users WHERE email = '${email}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserByRole(role: string) {
        const sql = `SELECT * FROM users WHERE id_role = (SELECT id FROM role WHERE role = '${role}')`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getFirstConnection(id_user: any) {
        const sql = `SELECT id_user FROM sessions WHERE id_user = '${id_user}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}


