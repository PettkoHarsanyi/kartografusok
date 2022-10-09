import { Game } from "src/games/entities/game";
import { User } from "../../users/entity/user";
import { IsString, IsDate } from "class-validator";
import { Message } from "../entities/message";
import { UserDto } from "../../users/dto/user.dto";
import { GameDto } from "../../games/dto/game.dto";

export class MessageDto{
    id?: number;

    @IsString()
    message?: string;

    user?: UserDto;
    
    game?: GameDto;


    constructor(message?: Message){
        if(message){
            this.id = message.id;
            this.message = message.message;
            
            if(message.user && message.user instanceof User){
                this.user = new UserDto(message.user);
            }            

            if(message.game && message.game instanceof Game){
                this.game = new GameDto(message.game);
            }
        }
    }
}