import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Patch, Query, UseGuards } from "@nestjs/common";
import { AllowAnonymous } from "../auth/allow-anonymous";
import { AuthService } from "../auth/auth.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { Roles } from "../auth/roles";
import { UserParam } from "../auth/user-param.decorator";
import { GameDto } from "../games/dto/game.dto";
import { GamesService } from "../games/games.service";
import { MessageDto } from "../messages/dto/message.dto";
import { MessagesService } from "../messages/messages.service";
import { UserAuthDto } from "./dto/user-auth.dto";
import { UpdateUserDto } from "./dto/user-update.dto";
import { UserDto } from "./dto/user.dto";
import { UserRole } from "./entity/user";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    
    constructor(
        private usersService: UsersService, 
        private authService: AuthService, 
        private gamesService: GamesService,
        private messageService: MessagesService,
    ){}

    @AllowAnonymous()
    @Post('')
    async create(@Body() userAuthDto: UserAuthDto){
        try{
            const newUser = await this.usersService.create(userAuthDto);
            return new UserDto(newUser);   
        }catch(e){
            if(e instanceof UniqueConstraintViolationException){
                throw new HttpException('Username is already taken',HttpStatus.CONFLICT)
            }else{
                throw e;
            }
        }
    }
    
    @Get("weekly")
    async weekly(){
        return await this.usersService.getWeekly();
    }
    
    @Roles(UserRole.Admin)
    @Patch('promote')
    async playerPromotion(){
        const playersToPromote = await this.usersService.getWeekly(3);
        const ids = playersToPromote.map(player => {
            return player.id
        });
        return this.usersService.promotePlayers(ids,true);
    }

    @Get('')
    async findAll(){
        return await this.usersService.findAll();
    }

    @Get(':id')
    async find(@Param('id', ParseIntPipe) id: number){
        return await this.usersService.find(id);
    }

    @Post(':id/games')
    async addGame(@Body() gameDto: GameDto, @Param('id', ParseIntPipe) id: number){
        const newGame = await this.gamesService.create(gameDto,id);
        return new GameDto(newGame);
    }

    @Post(':id/messages')
    async addMessage(@Body() messageDto: MessageDto, @Param('id', ParseIntPipe) id: number){
        const newMessage = await this.messageService.create(messageDto,id,1);
        return new MessageDto(newMessage);
    }

    @Get(':id/messages')
    async getMessages(@Param('id', ParseIntPipe) id: number){
        const messages = await this.messageService.findAll(id);
        return messages.map(message=>new MessageDto(message));
    }

    @Roles(UserRole.Admin)
    @Get(':id/games')
    async getGames(@Param('id', ParseIntPipe) id: number): Promise<GameDto[]> {
        const games = await this.gamesService.findAll(id);
        return games.map(game=>new GameDto(game));
    }

    @AllowAnonymous()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@UserParam() user: UserDto){
        return {
            user,
            access_token: await this.authService.generateJwt(user),
          };
    }

    @Patch(':id')
    async muteUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto){
        const newUser = await this.usersService.update(id, updateUserDto);
        return new UserDto(newUser);
    }

}

