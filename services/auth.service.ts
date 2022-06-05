import {UserProps} from "../models/UserProps";
import {db} from "../utils/mysql.connector";
import {SecurityUtils} from "../utils/security.utils";
import {SessionProps} from "../models/SessionProps";

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
        if (!user.name || !user.lastname || !user.password || !user.pseudo || !user.role) {
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

    public async logIn(data: Pick<UserProps, 'login' | 'password'>) : Promise<Boolean>{
        console.log(data)
        if(!data.login || !data.password){
            throw new Error("Data Missed");
        }
        let loginString = data.login;
        let passwordString = SecurityUtils.sha512(data.password);
        const sql = "SELECT * FROM users WHERE pseudo='"+loginString+"' AND password='"+passwordString+"'";
        try{
            let resultQuery = await this.selectPromise(sql);
            if(resultQuery.length > 0){
                let token = SecurityUtils.generateToken();
                let sql = "INSERT INTO sessions (token, user_id) VALUES ('"+token+"','"+result[0].id+"')";
            }
        }catch (error){
            return false;
        }
        return true;
    }

    public async getUserFrom(token: string) {
    }
}


