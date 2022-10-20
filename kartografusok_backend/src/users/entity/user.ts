import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, ReadOnlyException } from "@mikro-orm/core";
import { Division } from "../../divisions/entities/division";
import { Game } from "../../games/entities/game";
import { Message } from "../../messages/entities/message";
import { Result } from "../../results/entity/result";

@Entity()
export class User{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ unique: true })
    userName!: string;

    @Property({hidden: true})
    password!: string;

    @Property({nullable:true})
    email?: string;

    @Property()
    points?: number = 0;

    @Property()
    weekly?: number = 0;
    
    @Property({nullable:true})
    picture?: string = "profileimage.png";
    
    @Property()
    banned?: boolean = false;
    
    @Property()
    muted?: boolean = false;

    @Enum()
    role?: UserRole;
    
    @ManyToMany(()=> Game, (game)=>game.users)
    games? = new Collection<Game>(this);

    @OneToMany(()=> Message, (message)=>message.user)
    messages? = new Collection<Message>(this);

    @OneToMany(()=> Result, (result)=>result.user)
    results? = new Collection<Result>(this);

    @ManyToOne(()=>Division,{nullable:true})
    division?: Division;

    @Property({onCreate: ()=> new Date()})
    createdAt!: Date;

    @Property({onCreate: ()=> new Date(),onUpdate: ()=> new Date()})
    modifiedAt!: Date;
}

export enum UserRole{
    Admin = 'ADMIN',
    Contributor = "CONTRIBUTOR",
    User = 'USER',
}