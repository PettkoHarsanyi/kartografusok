import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroOrmConfig from '../mikro-orm.config';
import { GamesModule } from './games/games.module';
import { MessagesModule } from './messages/messages.module';
import { DivisionsModule } from './divisions/divisions.module';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ResultsModule } from './results/results.module';
import { MapsModule } from './maps/maps.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), GamesModule, DivisionsModule, MessagesModule, AuthModule, UsersModule, ResultsModule, MapsModule, CardsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule {}
