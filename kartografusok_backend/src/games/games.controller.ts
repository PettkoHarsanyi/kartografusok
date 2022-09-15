import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    // FINDALL - csak admin joggal
    constructor(private _gamesService: GamesService){}

    @Get()
    async findAll(@Query() gameDto: GameDto): Promise<GameDto[]> {
        const games = await this._gamesService.findAll(gameDto);
        return games.map(game=>new GameDto(game));
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<GameDto>{
        const game = await this._gamesService.findOne(id);

        if(!game){
            throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        }

        return new GameDto(game);
    }

    @Post()
    async create(@Body() gameDto: GameDto): Promise<GameDto> {
        const newGame = await this._gamesService.create(gameDto);
        return new GameDto(newGame);;
    }
}
