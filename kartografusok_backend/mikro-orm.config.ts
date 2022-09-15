import { Options, IDatabaseDriver } from "@mikro-orm/core";
import { Message } from "src/messages/entities/message";
import { Game } from "src/games/entities/game";
import { Division } from "src/divisions/entities/division";
import { User } from "src/users/entities/user";

export default {
    entities: [Game, Message, Division, User ],
    dbName: 'kartografusok.sqlite3',
    type: 'sqlite',
    migrations: {
        path: "./migrations"
    }    
} as Options<IDatabaseDriver>