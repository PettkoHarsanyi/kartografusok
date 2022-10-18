import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { MapDto } from './dto/map.dto';
import { Map } from './entities/map';

@Injectable()
export class MapsService {
    constructor(
        @InjectRepository(Map)
        private mapRepository: EntityRepository<Map>,
    ){}

    async findAll() {
        return this.mapRepository.findAll();
    }

    async create(mapDto: MapDto) {
        const map = new Map();

        map.blocks = mapDto.blocks;

        await this.mapRepository.persistAndFlush(map);

        return map;
    }
}
