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

    public async subscribeUser(user: Partial<UserProps>):Promise<boolean> {
        if (!user.name || !user.lastname || !user.password || !user.login) {
            throw new Error("Data Missed");
        } else {
            let passwordString = SecurityUtils.sha512(user.password);
            let nameString = user.name;
            let lastNameString = user.lastname;
            let loginString = user.login;
            const sql = "INSERT INTO users (name, lastname,password, login) VALUES ('"+nameString+"','"+lastNameString+"','"+passwordString+"','"+loginString+"')";
            try{
                await this.insertPromise(sql);
                return true;
            }catch (error){
                return false;
            }
        }
    }

    insertPromise = (sql:string) =>{
        return new Promise((resolve, reject)=>{
            db.query(sql,  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    public async logIn(data: Pick<UserProps, 'login' | 'password'>) : Promise<string>{
        console.log(data)
        if(!data.login || !data.password){
            throw new Error("Data Missed");
        }
        let login = data.login;
        let password = SecurityUtils.sha512(data.password);
        try{
            let resultQuery = await this.getUserByLoginPass(login, password);
            const user_id = resultQuery[0].id;
            if(resultQuery.length > 0){
                let token = SecurityUtils.generateToken();
                let sql = "INSERT INTO sessions (token, id_user) VALUES ('"+token+"','"+ user_id+"')";
                try {
                    await this.insertPromise(sql);
                    return token;
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Error in insert session");
                }
            }
            throw new Error("User not found");
        }catch (error){
            throw new Error("SQl error" + error);
        }
    }

    public async getUserFrom(token: string) {
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
    };
}


