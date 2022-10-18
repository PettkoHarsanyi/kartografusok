import { Options, IDatabaseDriver } from "@mikro-orm/core";
import { Message } from "./src/messages/entities/message";
import { Game } from "./src/games/entities/game";
import { Division } from "./src/divisions/entities/division";
import { User } from "./src/users/entity/user"
import { Result } from "./src/results/entity/result";
import { Map } from "./src/maps/entities/map";
import { Card } from "./src/cards/entities/card";

export default {
    entities: [Message, Game, Division, User, Result, Map, Card],
    dbName: 'kartografusok.sqlite3',
    type: 'sqlite',
    migrations:{
        path: './migrations',
        pattern: /^[\w-]+\d+\.(ts|js)$/,
      }  
} as Options<IDatabaseDriver>