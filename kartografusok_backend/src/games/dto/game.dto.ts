import { MessageDto } from "src/messages/dto/message.dto";
import { Message } from "src/messages/entities/message";
import { User } from "src/users/entity/user";
import { Game } from "../entities/game";
import { IsDate, IsInt } from "class-validator";
import { UserDto } from "../../users/dto/user.dto";
import { ResultDto } from "../../results/dto/result.dto";

export class GameDto{
    id?: number;

    users?: UserDto[];

    duration?: number;

    messages?: MessageDto[];
    
    results?: ResultDto[];

    constructor(game?: Game){
        if(game){
            this.id = game.id;

            this.duration = game.duration;

            if(game.messages?.isInitialized(true)) {
                this.messages = game.messages.getItems().map((message)=>new MessageDto(message));
            }

            if(game.users?.isInitialized(true)){
                this.users = game.users.getItems().map((user)=> new UserDto(user));
            }

            if(game.results?.isInitialized(true)){
                this.results = game.results.getItems().map((result)=> new ResultDto(result));
            }
        }
    }
}