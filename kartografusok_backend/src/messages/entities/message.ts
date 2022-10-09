import { DateType, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Game } from "../../games/entities/game";
import { User } from "../../users/entity/user";

@Entity()
export class Message{
    @PrimaryKey()
    id!: number;

    @ManyToOne(()=>Game, {nullable:true})
    game?: Game;

    @ManyToOne(()=>User)
    user: User;

    @Property()
    message: string;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}