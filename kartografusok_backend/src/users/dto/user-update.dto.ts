import { DivisionDto } from "../../divisions/dto/division.dto";
import { Division } from "../../divisions/entities/division";
import { User, UserRole } from "../entity/user";

export class UpdateUserDto{
    id?: number;
    name?: string;
    userName?: string;
    email?: string;
    points?: number;
    weekly?: number;
    picture?: string;
    division?: DivisionDto;
    banned?: boolean;
    muted?: boolean;
    role?: UserRole;

    constructor(user?: User){
        if(user){
            this.id = user.id;
            this.name = user.name;
            this.userName = user.userName;
            this.role = user.role;
            this.email = user.email;
            this.points = user.points;
            this.weekly = user.weekly;
            this.picture = user.picture;
            this.banned = user.banned;
            this.muted = user.muted;
            this.role = user.role;
            this.division = user.division;
        }
    }
}