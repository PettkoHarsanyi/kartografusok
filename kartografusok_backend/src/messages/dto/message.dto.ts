import { Game } from "src/games/entities/game";
import { Message } from "../entities/message";

export class MessageDto{
    id?: number;
    // TODO
    // @ManyToOne()
    // user: User;
    message?: string;
    sendDate?: Date;

    constructor(message?: Message){
        if(message){
            this.id = message.id;
            this.message = message.message;
            this.sendDate = message.sendDate;
        }
    }
}