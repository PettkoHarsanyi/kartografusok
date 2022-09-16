import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MessagesModule } from "../messages/messages.module";
import { User } from "../users/entity/user";
import { Game } from "./entities/game";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";



@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Game,User] }), MessagesModule],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService]
})
export class GamesModule {}
