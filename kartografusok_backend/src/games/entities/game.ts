import { Collection, DateType, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Message } from "../../messages/entities/message";
import { User } from "../../users/entity/user";

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

    @Property({nullable:true})
    points!: number;

    @Property({nullable:true})
    duration!: number;

    @Property({nullable:true})
    place!: number

    @OneToMany(()=>Message, (message)=>message.game)
    messages = new Collection<Message>(this);

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}