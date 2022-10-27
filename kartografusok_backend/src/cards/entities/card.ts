import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Card{
    @PrimaryKey()
    id!: number;
    
    @Property()
    name!: string;

    @Property({nullable: true})
    duration?: number;
    
    @Property({nullable:true})
    picture?: string;

    @Property({nullable: true})
    official?: boolean = false;

    @Enum()
    cardType?: CardType;

    @Enum({nullable: true})
    fieldType1?: FieldType;

    @Enum({nullable: true})
    fieldType2?: FieldType;

    @Property({nullable: true})
    direction?: number;

    @Property({nullable: true})
    blocks1?: string;

    @Property({nullable: true})
    blocks2?: string;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}

export enum CardType{
    Raid = 'RAID',
    Explore = "EXPLORE",
    Ruin = "RUIN"
}

export enum FieldType{
    Forest = "FOREST",
    Village = "VILLAGE",
    Farm = "FARM",
    Water = "WATER",
    Monster = "MONSTER",
    Any = "ANY"
}