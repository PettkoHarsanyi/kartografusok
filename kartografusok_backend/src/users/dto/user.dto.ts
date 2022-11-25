import { Division } from "src/divisions/entities/division";
import { GameDto } from "../../games/dto/game.dto";
import { Game } from "../../games/entities/game";
import { MessageDto } from "../../messages/dto/message.dto";
import { Message } from "../../messages/entities/message";
import { ResultDto } from "../../results/dto/result.dto";
import { Result } from "../../results/entity/result";
import { User, UserRole } from "../entity/user";

export class UserDto{
    id: number;
    name: string;
    userName: string;
    role?: UserRole;
    weekly?: number;
    points?: number;
    muted?: boolean;
    banned?: boolean;
    division?: Division;
    games?: GameDto[];
    messages?: MessageDto[];
    results?: ResultDto[];
    reports?: number;
    email?: string;

    constructor(user?: User){
        if(user){
            this.id = user.id;
            this.name = user.name;
            this.userName = user.userName;
            this.role = user.role;
            this.weekly = user.weekly;
            this.points = user.points;
            this.muted = user.muted;
            this.banned = user.banned;
            this.division = user.division;
            this.reports = user.reports;
            this.email = user.email;
        }
    }
}