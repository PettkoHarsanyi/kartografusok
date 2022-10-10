import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { DivisionDto } from './dto/division.dto';
import { Division } from './entities/division';

@Injectable()
export class DivisionsService {
    findAll() {
        return this.divisionRepository.findAll();
    }

    constructor(
        @InjectRepository(Division)
        private divisionRepository: EntityRepository<Division>,
    ){}

    async create(divisionDto: DivisionDto): Promise<Division> {
        const division = new Division();
        division.name = divisionDto.name;

        await this.divisionRepository.persistAndFlush(division);
        return division;
    }
}
