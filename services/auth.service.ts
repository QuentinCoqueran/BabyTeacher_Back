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

    public async subscribeUser() {
        return false;
    }

    public async logIn(data: { password: any; login: any }, password: string) {
        console.log(data)
        return false;
    }

    public async getUserFrom(token: string) {
    }
}


