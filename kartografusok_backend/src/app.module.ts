import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroOrmConfig from 'mikro-orm.config';
import { GamesModule } from './games/games.module';
import { MessagesModule } from './messages/messages.module';
import { DivisionsModule } from './divisions/divisions.module';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), GamesModule, DivisionsModule, MessagesModule, AuthModule, UsersModule],
  controllers: [UsersController],
})
export class AppModule {}
