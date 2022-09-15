import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Division{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}