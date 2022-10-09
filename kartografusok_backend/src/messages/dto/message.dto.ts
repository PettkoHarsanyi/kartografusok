import { Game } from "src/games/entities/game";
import { User } from "../../users/entity/user";
import { IsString, IsDate } from "class-validator";
import { Message } from "../entities/message";
import { UserDto } from "../../users/dto/user.dto";
import { GameDto } from "../../games/dto/game.dto";

export class MessageDto{
    id?: number;

    message?: string;

    user?: UserDto;


    constructor(_message?: Message){
        if(_message){
            this.id = _message.id;
            this.message = _message.message;
            
            if(_message.user && _message.user instanceof User){
                this.user = new UserDto(_message.user);
            }            
        }
    }
}