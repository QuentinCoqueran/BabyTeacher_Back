import {UserProps} from "../models/UserProps";
import {db} from "../utils/mysql.connector";
import {SecurityUtils} from "../utils/security.utils";

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
        if (!user.name || !user.lastname || !user.password || !user.pseudo) {
            throw new Error("Data Missed");
        } else {
            let passwordString = SecurityUtils.sha512(user.password);
            let nameString = user.name;
            let lastNameString = user.lastname;
            let pseudoString = user.pseudo;
            var sql = "INSERT INTO users (name, lastname,password,pseudo) VALUES ('"+nameString+"','"+lastNameString+"','"+passwordString+"','"+pseudoString+"')";
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
    public async logIn(data: { password: any; login: any }, password: string) {
        console.log(data)
        return false;
    }

    public async getUserFrom(token: string) {
    }
}


