import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';
import { Division } from './entities/division';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Division] })],
  providers: [DivisionsService],
  controllers: [DivisionsController],
})
export class DivisionsModule {}
