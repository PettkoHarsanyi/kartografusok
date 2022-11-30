import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Game } from '../games/entities/game';
import { User } from '../users/entity/user';
import { Result } from './entity/result';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Result, User, Game] }),],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService]
})
export class ResultsModule {}
