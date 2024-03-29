import { Loaded } from '@mikro-orm/core';
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
    ) { }

    async remove(map: Loaded<Map, never>) {
        return this.mapRepository.remove(map).flush();
    }

    async findAll() {
        return this.mapRepository.findAll();
    }

    async find(id: number) {
        return await this.mapRepository.findOne(({
            id: id,
        }))
    }

    async create(mapDto: MapDto) {
        const map = new Map();

        map.blocks = mapDto.blocks;
        map.name = mapDto.name || map.name;
        map.picture = mapDto.picture;

        await this.mapRepository.persistAndFlush(map);

        return map;
    }
}
