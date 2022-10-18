import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Map{
    @PrimaryKey()
    id!: number;

    @Property()
    blocks?: string;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}