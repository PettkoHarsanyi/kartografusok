import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Map } from './entities/map';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Map] }),],
  controllers: [MapsController],
  providers: [MapsService],
  exports: [MapsService]
})
export class MapsModule {}
