import { DateType, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Game } from "src/games/entities/game";
import { User } from "src/users/entity/user";

@Entity()
export class Message{
    @PrimaryKey()
    id!: number;

    @ManyToOne(()=>Game)
    game: Game;

    // TODO
    @ManyToOne(()=>User)
    user: User;

    @Property()
    message: string;

    @Property({ type: DateType })
    sendDate: Date;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}