import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { GamesModule } from "../games/games.module";
import { GamesService } from "../games/games.service";
import { MessagesModule } from "../messages/messages.module";
import { User } from "./entity/user";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";


@Module({
  imports: [MikroOrmModule.forFeature({entities: [User]}), AuthModule, GamesModule, MessagesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
