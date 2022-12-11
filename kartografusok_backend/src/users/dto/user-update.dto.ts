import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { DivisionDto } from "../../divisions/dto/division.dto";
import { Division } from "../../divisions/entities/division";
import { User, UserRole } from "../entity/user";

export class UpdateUserDto{
    id?: number;

    
    @IsOptional()
    @Length(4, 20,{
        message: "A játékosnév legalább 4 hosszú legyen"
    })
    @IsNotEmpty({
        message: "A játékosnév nem lehet üres"
    })
    @IsString({
        message: "A játékosnév szöveges legyen"
    })
    name?: string;

    

    @IsOptional()
    @Length(4, 20,{
        message: "A felhasználónév legalább 4 hosszú legyen"
    })
    @IsNotEmpty({
        message: "A felhasználónév nem lehet üres"
    })
    @IsString({
        message: "A felhasználónév szöveges legyen"
    })
    userName?: string;


    email?: string;
    points?: number;
    weekly?: number;
    picture?: string;
    division?: DivisionDto;
    banned?: boolean;
    muted?: boolean;
    role?: UserRole;

    @IsOptional()
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

    constructor(user?: User){
        if(user){
            this.id = user.id;
            this.name = user.name;
            this.userName = user.userName;
            this.role = user.role;
            this.email = user.email;
            this.points = user.points;
            this.weekly = user.weekly;
            this.picture = user.picture;
            this.banned = user.banned;
            this.muted = user.muted;
            this.role = user.role;
            this.division = user.division;
            this.password = user.password;
        }
    }
}