import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Message } from "../messages/entities/message";
import { MessagesModule } from "../messages/messages.module";
import { Result } from "../results/entity/result";
import { User } from "../users/entity/user";
import { UsersModule } from "../users/users.module";
import { Game } from "./entities/game";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";



@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Game,User,Result,Message] }), MessagesModule],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService]
})
export class GamesModule {}
