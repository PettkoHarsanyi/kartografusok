import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user';
import { ResultDto } from './dto/result.dto';
import { Result } from './entity/result';

@Injectable()
export class ResultsService {

    constructor(
        @InjectRepository(User)
        private usersRepository: EntityRepository<User>,
        @InjectRepository(Result)
        private resultRepository: EntityRepository<Result>,
    ){}

    async create(resultDto: ResultDto,id: number) {
        const result = new Result();
        result.place = resultDto.place;
        result.points = resultDto.points;
        
        result.user = this.usersRepository.getReference(id);

        await this.resultRepository.persistAndFlush(result);
        return result;
    }
}
