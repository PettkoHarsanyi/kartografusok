import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Roles } from 'src/auth/roles';
import { UserRole } from 'src/users/entity/user';
import { AllowAnonymous } from '../auth/allow-anonymous';
import { MessageDto } from '../messages/dto/message.dto';
import { MessagesService } from '../messages/messages.service';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor
    (
        private _gamesService: GamesService,
        private messageService: MessagesService
    ){}
        
        // FINDALL - csak admin joggal
    @Roles(UserRole.Admin)
    @Get()
    async findAll(): Promise<GameDto[]> {
        const games = await this._gamesService.findAll();
        return games.map(game=>new GameDto(game));
    }

    @AllowAnonymous()
    @Post()
    create(@Body() gameDto: GameDto) {
        return this._gamesService.create(gameDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<GameDto>{
        const game = await this._gamesService.findOne(id);

        if(!game){
            throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        }

        return new GameDto(game);
    }

    @Get(':id/messages')
    async getMessage(@Param('id', ParseIntPipe) id: number){
        const messages = await this.messageService.findAllOfGame(id);
        return messages.map(message=>new MessageDto(message));
    }
}
