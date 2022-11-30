import { GameDto } from "../../games/dto/game.dto";
import { Game } from "../../games/entities/game";
import { UserDto } from "../../users/dto/user.dto";
import { User } from "../../users/entity/user";
import { Result } from "../entity/result";

export class ResultDto {
    id?: number;
    user?: UserDto;
    points?: number;
    place?: number;
    game?: GameDto;

    constructor(result?: Result) {
        if (result) {
            this.id = result.id;
            this.points = result.points;
            this.place = result.place;

            if (result.user && result.user instanceof User) {
                this.user = new UserDto(result.user);
            }
        }
    }
}