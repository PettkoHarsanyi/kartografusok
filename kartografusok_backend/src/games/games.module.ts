import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Game } from './entities/game';


@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Game] })],
  providers: [GamesService],
  controllers: [GamesController]
})
export class GamesModule {}
