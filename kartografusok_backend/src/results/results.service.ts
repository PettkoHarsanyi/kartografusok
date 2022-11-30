import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Game } from '../games/entities/game';
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
        @InjectRepository(Game)
        private gameRepository: EntityRepository<Game>,
    ){}

    async create(resultDto: ResultDto,id: number) {
        const result = new Result();
        result.place = resultDto.place;
        result.points = resultDto.points;

        if(resultDto.game){
            result.game = this.gameRepository.getReference(resultDto.game.id);
        }
        
        result.user = this.usersRepository.getReference(id);

        await this.resultRepository.persistAndFlush(result);
        return result;
    }
}
