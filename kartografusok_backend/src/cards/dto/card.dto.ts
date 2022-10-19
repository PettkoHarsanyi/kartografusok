import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { Card, CardType, FieldType } from "../entities/card";

@Entity()
export class CardDto{
    id: number;
    name?: string;
    duration?: number;
    cardType?: CardType;
    fieldType1?: FieldType;
    fieldType2?: FieldType;
    direction?: number;
    blocks1?: string;
    blocks2?: string;
    picture?: string;

    constructor(card?: Card){
        if(card){
            this.id = card.id;
            this.name = card.name;
            this.duration = card.duration;
            this.cardType = card.cardType;
            this.fieldType1 = card.fieldType1;
            this.fieldType2 = card.fieldType2;
            this.direction = card.direction;
            this.blocks1 = card.blocks1;
            this.blocks2 = card.blocks2;
            this.picture = card.picture;
        }
    }
}