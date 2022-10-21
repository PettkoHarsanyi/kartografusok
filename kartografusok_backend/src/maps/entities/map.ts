import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Map{
    @PrimaryKey()
    id!: number;

    @Property({nullable: true})
    name?: string;

    @Property()
    blocks?: string;

    @Property({nullable: true})
    picture?: string;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}