import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable, Query } from '@nestjs/common';
import { User } from 'src/users/entity/user';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)
        private gameRepository: EntityRepository<Game>,
        @InjectRepository(User)
        private userRepository: EntityRepository<User>
    ){}

    async findAll(id?: number): Promise<Game[]> {
        if(id){
            return await this.gameRepository.find(
                {
                    user: id,
                },
                {
                    populate: ['user.name'],
                }
                );
        }else{
            return await this.gameRepository.findAll();
        }
    }

    async findOne(id: number): Promise<Game>{
        return await this.gameRepository.findOne(id)
    }

    async create(gameDto: GameDto, id: number): Promise<Game> {
        const game = new Game();
        game.user = this.userRepository.getReference(id);
        game.gameId = gameDto.gameId;
        game.gameDate = gameDto.gameDate;
        game.points = gameDto.points;

        await this.gameRepository.persistAndFlush(game);
        return game;
    }
}
