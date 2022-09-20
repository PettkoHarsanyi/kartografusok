import { IsNotEmpty, IsAlpha, Length, IsString } from "class-validator";
import { User } from "../entity/user";

export class UserAuthDto{
    @Length(4, 20)
    @IsNotEmpty()
    @IsString()
    name?: string;

    @Length(4, 20)
    @IsNotEmpty()
    @IsString()
    userName?: string;

    @Length(4, 20)
    @IsNotEmpty()
    @IsString()
    password?: string;

    constructor(user?: User){
        if(user){
            this.name = user.name;
            this.userName = user.userName;
            this.password = user.password;
        }
    }
}