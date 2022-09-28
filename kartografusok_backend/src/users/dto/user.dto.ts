import { User, UserRole } from "../entity/user";

export class UserDto{
    id?: number;
    name?: string;
    role?: UserRole;
    weekly?: number;
    points?: number;
    muted?: boolean;
    banned?: boolean;

    constructor(user?: User){
        if(user){
            this.id = user.id;
            this.name = user.name;
            this.role = user.role;
            this.weekly = user.weekly;
            this.points = user.points;
            this.muted = user.muted;
            this.banned = user.banned;
        }
    }
}