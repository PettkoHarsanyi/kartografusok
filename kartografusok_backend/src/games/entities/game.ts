import { Collection, DateType, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Message } from "../../messages/entities/message";
import { Result } from "../../results/entity/result";
import { User } from "../../users/entity/user";

@Entity()
export class Game{
    @PrimaryKey()
    id!: number;

    @ManyToMany(()=> User, 'games', {owner: true})
    users = new Collection<User>(this);

    @OneToMany(()=>Message, (message)=>message.game, {orphanRemoval: true})
    messages = new Collection<Message>(this);
    
    @OneToMany(()=>Result, result => result.game, {orphanRemoval: true})
    results = new Collection<Result>(this);

    @Property({nullable:true})
    duration!: number;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}