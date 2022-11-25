import { IsNotEmpty, IsAlpha, Length, IsString, IsOptional } from "class-validator";
import { User } from "../entity/user";

export class UserAuthDto{
    @Length(4, 20,{
        message: "A felhasználónév legalább 4 hosszú legyen"
    })
    @IsNotEmpty({
        message: "A felhasználónév nem lehet üres"
    })
    @IsString({
        message: "A felhasználónév szöveges legyen"
    })
    name?: string;

    @Length(4, 20,{
        message: "A játékosnév legalább 4 hosszú legyen"
    })
    @IsNotEmpty({
        message: "A játékosnév nem lehet üres"
    })
    @IsString({
        message: "A játékosnév szöveges legyen"
    })
    userName?: string;

    @Length(4, 20,{
        message: "A jelszó legalább 4 hosszú legyen"
    })
    @IsNotEmpty({
        message: "A jelszó nem lehet üres"
    })
    @IsString({
        message: "A jelszó szöveges legyen"
    })
    password?: string;

    points?: number;
    weekly?: number;
    reports?: number;

    constructor(user?: User){
        if(user){
            this.name = user.name;
            this.userName = user.userName;
            this.password = user.password;
            this.points = user.points;
            this.weekly = user.weekly;
            this.reports = user.reports;
        }
    }
}