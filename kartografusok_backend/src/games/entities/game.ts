import { Collection, DateType, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Message } from "src/messages/entities/message";
import { User } from "src/users/entities/user";

@Entity()
export class Game{
    @PrimaryKey()
    id!: number;

    @Property()
    gameId: number;

    // TODO
    @ManyToOne(()=>User)
    user!: User;

    @Property({ type:DateType })
    gameDate!: Date;

    @Property()
    points!: number;

    @OneToMany(()=>Message, (message)=>message.game)
    messages = new Collection<Message>(this);

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}