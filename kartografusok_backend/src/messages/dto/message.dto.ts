import { Game } from "src/games/entities/game";
import { User } from "../../users/entity/user";
import { IsString, IsDate } from "class-validator";
import { Message } from "../entities/message";

export class MessageDto{
    id?: number;
    user: User;
    game: Game;

    @IsString()
    message?: string;

    sendDate?: Date;

    constructor(message?: Message){
        if(message){
            this.id = message.id;
            this.user = message.user;
            this.game = message.game;
            this.message = message.message;
            this.sendDate = message.sendDate;
        }
    }
}