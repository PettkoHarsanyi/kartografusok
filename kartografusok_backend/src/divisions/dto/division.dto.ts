import { IsString } from "class-validator";
import { Division } from "../entities/division";

export class DivisionDto{
    id?: number;
    name?: string;

    constructor(division?: Division){
        if(division){
            this.name = division.name
        }
    }
}