import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable, Query } from '@nestjs/common';
import { wrap } from 'module';
import { User } from 'src/users/entity/user';
import { Message } from '../messages/entities/message';
import { ResultDto } from '../results/dto/result.dto';
import { Result } from '../results/entity/result';
import { UserDto } from '../users/dto/user.dto';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game';

@Injectable()
export class GamesService {


    constructor(
        @InjectRepository(Game)
        private gameRepository: EntityRepository<Game>,
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,
        @InjectRepository(Result)
        private resultRepository: EntityRepository<Result>,
        @InjectRepository(Message)
        private messageRepository: EntityRepository<Message>,
    ){}

    async findAll(id?: number){
        return await this.gameRepository.find({
            users: id,
        },{
            populate: ['users','messages','results','createdAt'],
            fields: ['duration','createdAt'],
            populateWhere: {
                results: {
                    user: id,
                },
                messages: {
                    user: id,
                }
            }
        }
        )
    }

    
    async connectToPlayer(game: Game, userDto: UserDto) {

        const user = this.userRepository.getReference(userDto.id);

        game.users.set([...game.users, user])
        
        await this.gameRepository.persistAndFlush(game);
        return game;
    }

    async findOne(id: number): Promise<Game>{
        return await this.gameRepository.findOne(id)
    }

    async createFromUser(gameDto: GameDto, id: number): Promise<Game> {
        const game = new Game();
        game.duration = gameDto.duration;
        
        game.results.set(
            gameDto.results?.map((result)=>{
                return this.resultRepository.getReference(result.id)
            },) || [],
        )

        game.users.set(
            [this.userRepository.getReference(id)]
        )
        game.messages.set(
            gameDto.messages?.map(message=>this.messageRepository.getReference(message.id),) || [],
        )

        await this.gameRepository.persistAndFlush(game);
        return game;
    }

    async create(gameDto: GameDto): Promise<Game> {
        const game = new Game();
        game.duration = gameDto.duration;

        console.log(gameDto.users);

        gameDto.users.map((user)=>console.log(user));
        
        game.results.set(
            gameDto.results?.map((result)=>{
                const _result = this.resultRepository.getReference(result.id)
                _result.game = game;
                return _result;
            },) || [],
        )

        game.users.set(
            gameDto.users?.map((user)=>{
                let theUser = this.userRepository.getReference(user.id)
                return theUser;
            }) || []
        )

        game.messages.set(
            gameDto.messages?.map(message=>this.messageRepository.getReference(message.id),) || [],
        )

        await this.gameRepository.persistAndFlush(game);
        return game;
    }
}
