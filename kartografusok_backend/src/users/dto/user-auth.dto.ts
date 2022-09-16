import { User } from "../entity/user";

export class UserAuthDto{
    name?: string;
    userName?: string;
    password?: string;

    constructor(user?: User){
        if(user){
            this.name = user.name;
            this.userName = user.userName;
            this.password = user.password;
        }
    }
}