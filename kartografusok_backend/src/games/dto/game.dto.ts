import { MessageDto } from "src/messages/dto/message.dto";
import { Message } from "src/messages/entities/message";
import { User } from "src/users/entity/user";
import { Game } from "../entities/game";
import { IsDate, IsInt } from "class-validator";

export class GameDto{
    id?: number;

    @IsInt()
    gameId?: number;

    user?: User;

    gameDate?: Date;

    @IsInt()
    points?: number;
    messages?: MessageDto[];

    constructor(game?: Game){
        if(game){
            this.id = game.id;
            this.gameId = game.gameId;
            this.user = game.user;
            this.gameDate = game.gameDate;
            this.points = game.points;
            
            if(game.messages?.isInitialized(true)) {
                this.messages = game.messages.getItems().map((message)=>new MessageDto(message));
            }
        }
    }
}