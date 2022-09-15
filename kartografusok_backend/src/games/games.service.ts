import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable, Query } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)
        private gameRepository: EntityRepository<Game>
    ){}

    async findAll(gameDto?: GameDto): Promise<Game[]> {
        return await this.gameRepository.find({
            id: gameDto.id
        });
    }

    async findOne(id: number): Promise<Game>{
        return await this.gameRepository.findOne(id)
    }

    async create(gameDto: GameDto): Promise<Game> {
        const game = new Game();
        
        game.gameId = gameDto.gameId;
        // game.user = gameDto.user;
        game.gameDate = gameDto.gameDate;
        game.points = gameDto.points;
        // game.messages = gameDto.messages;

        await this.gameRepository.persistAndFlush(game);

        return game;
    }
}
