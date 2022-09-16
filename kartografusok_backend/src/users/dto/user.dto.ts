import { User, UserRole } from "../entity/user";

export class UserDto{
    id?: number;
    name?: string;
    role?: UserRole;

    constructor(user?: User){
        if(user){
            this.id = user.id;
            this.name = user.name;
            this.role = user.role;
        }
    }
}