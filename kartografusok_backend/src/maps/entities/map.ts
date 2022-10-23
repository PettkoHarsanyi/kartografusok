import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Map{
    @PrimaryKey()
    id!: number;

    @Property({nullable: true})
    name?: string = "usermap";

    @Property()
    blocks?: string;

    @Property({nullable: true})
    picture?: string;

    @Property({nullable: true})
    official?: boolean = false;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}