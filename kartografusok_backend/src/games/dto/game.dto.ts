import { MessageDto } from "src/messages/dto/message.dto";
import { Message } from "src/messages/entities/message";
import { User } from "src/users/entities/user";
import { Game } from "../entities/game";

export class GameDto{
    id?: number;
    gameId?: number;
    // user?: User;
    gameDate?: Date;
    points?: number;
    messages?: MessageDto[];

    constructor(game?: Game){
        if(game){
            this.id = game.id;
            this.gameId = game.gameId;
            //  this.user = game.user;
            this.gameDate = game.gameDate;
            this.points = game.points;
            
            if(game.messages?.isInitialized(true)) {
                this.messages = game.messages.getItems().map((message)=>new MessageDto(message));
            }
        }
    }
}