import { IsString } from "class-validator";

export class DivisionDto{
    id?: number;

    @IsString()
    name?: string;
}