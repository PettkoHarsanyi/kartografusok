import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property, ReadOnlyException } from "@mikro-orm/core";
import { Division } from "src/divisions/entities/division";
import { Game } from "src/games/entities/game";
import { Message } from "src/messages/entities/message";

@Entity()
export class User{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ unique: true })
    userName!: string;

    @Property()
    password!: string;

    @Property({nullable:true})
    email?: string;

    @Property()
    points: number = 0;

    @Property()
    weekly: number = 0;
    
    @Property({nullable:true})
    picture?: string;
    
    @Property()
    banned: boolean = false;
    
    @Property()
    muted: boolean = false;

    @Enum()
    role: UserRole;
    
    @OneToMany(()=>Game, game=> game.user)
    games = new Collection<Game>(this);
    
    @OneToMany(()=>Game, game=> game.user)
    messages = new Collection<Message>(this);

    @ManyToOne(()=>Division,{nullable:true})
    division?: Division;
}

export enum UserRole{
    Admin = 'ADMIN',
    Contributor = "CONTRIBUTOR",
    User = 'USER',
}