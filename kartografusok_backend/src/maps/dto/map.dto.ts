import { Entity } from "@mikro-orm/core";
import { Map } from "../entities/map";

@Entity()
export class MapDto{
    id: number;
    blocks?: string;
    name?: string;
    picture?: string;

    constructor(map?: Map){
        if(map){
            this.id = map.id;
            this.blocks = map.blocks;
            this.name = map.name;
            this.picture = map.picture;
        }
    }
}