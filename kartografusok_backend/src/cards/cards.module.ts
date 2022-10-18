import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './entities/card';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Card] }),],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
