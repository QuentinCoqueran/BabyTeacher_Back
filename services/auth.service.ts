import {UserProps} from "../models/UserProps";
import {db} from "../utils/mysql.connector";
import {SecurityUtils} from "../utils/security.utils";
import {SessionProps} from "../models/SessionProps";
import {RowDataPacket} from "mysql2";

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

    public async subscribeUser(user: Partial<UserProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: ""}
        console.log(user.login)
        if (!user.name || !user.lastname || !user.password || !user.login || !user.role) {
            throw new Error("Data Missed");
        } else {
            const userByLogin = await this.getUserByLogin(user.login);
            console.log(userByLogin.length)
            if (userByLogin.length != 0) {
                errorObj = {response: true, type: "Le pseudo existe déjà"}
                return errorObj;
            }
            let passwordString = SecurityUtils.sha512(user.password);
            let nameString = user.name;
            let lastNameString = user.lastname;
            let loginString = user.login;
            let roleString = user.role;
            const sql = `INSERT INTO users (name, lastname,password,login,id_role) VALUES ('${nameString}', '${lastNameString}','${passwordString}','${loginString}',
            (SELECT id FROM role WHERE role = '${roleString}'))`;
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

    public async logIn(data: Pick<UserProps, 'login' | 'password'>): Promise<Boolean> {
        console.log(data)
        if (!data.login || !data.password) {
            throw new Error("Data Missed");
        }
        let loginString = data.login;
        let passwordString = SecurityUtils.sha512(data.password);
        const sql = "SELECT * FROM users WHERE pseudo='" + loginString + "' AND password='" + passwordString + "'";
        try {
            //let resultQuery = await this.selectPromise(sql);
            //if(resultQuery.length > 0){
            //let token = SecurityUtils.generateToken();
            //let sql = "INSERT INTO sessions (token, user_id) VALUES ('"+token+"','"+result[0].id+"')";
            //}
        } catch (error) {
            return false;
        }
        return true;
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

    getUserFrom(token: string) {

    }
}


