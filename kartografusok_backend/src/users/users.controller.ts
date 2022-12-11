import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Patch, Query, UseGuards, UseInterceptors, UploadedFile, Res, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AllowAnonymous } from "../auth/allow-anonymous";
import { AuthService } from "../auth/auth.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { Roles } from "../auth/roles";
import { UserParam } from "../auth/user-param.decorator";
import { DivisionsService } from "../divisions/divisions.service";
import { DivisionDto } from "../divisions/dto/division.dto";
import { GameDto } from "../games/dto/game.dto";
import { GamesService } from "../games/games.service";
import { MessageDto } from "../messages/dto/message.dto";
import { MessagesService } from "../messages/messages.service";
import { ResultDto } from "../results/dto/result.dto";
import { ResultsService } from "../results/results.service";
import { UserAuthDto } from "./dto/user-auth.dto";
import { UpdateUserDto } from "./dto/user-update.dto";
import { UserDto } from "./dto/user.dto";
import { User, UserRole } from "./entity/user";
import { UsersService } from "./users.service";
import { diskStorage } from 'multer';
import { Observable, of } from "rxjs";
import { extname, join } from "path";
import * as fs from 'fs';
import { UpdateResultDto } from "../results/dto/updateResult.dto";
import { Request } from 'express';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private gamesService: GamesService,
        private messageService: MessagesService,
        private resultService: ResultsService,
        private divisionsService: DivisionsService
    ) { }

    @AllowAnonymous()
    @Post('')
    async create(@Body() userAuthDto: UserAuthDto) {
        try {
            const newUser = await this.usersService.create(userAuthDto);
            return new UserDto(newUser);
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException('Már van ilyen nevű felhasználó', HttpStatus.CONFLICT)
            } else {
                throw e;
            }
        }
    }

    @Get("weekly")
    async weekly() {
        return await this.usersService.getWeekly();
    }

    @Get("alltime")
    async alltime() {
        return await this.usersService.getAllTime();
    }

    @AllowAnonymous()
    @Patch('promote')
    async playerPromotion(@Body() data: object, @Req() request: Request) {
        // console.log(request.ips);
        let ip = request.ip
        ip = ip.replace('::ffff:', '');

        if (data["password"] === "password" && ip === "127.0.0.1") {
            const playersToPromote = await this.usersService.getWeekly(3);
            const ids = playersToPromote.map(player => {
                return player.id
            });

            this.usersService.nullWeekly();
            return this.usersService.promotePlayers(ids, true);

        } else {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

    }

    @Roles(UserRole.Admin)
    @Get('')
    async findAll() {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async find(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.find(id);
    }

    @Post(':id/games')
    async addGame(@Body() gameDto: GameDto, @Param('id', ParseIntPipe) id: number) {
        const newGame = await this.gamesService.createFromUser(gameDto, id);
        return new GameDto(newGame);
    }

    @AllowAnonymous()
    @Patch(":id/connectgame")
    async connectToGame(@Param('id', ParseIntPipe) id: number, @Body() gameDto: GameDto) {
        const user = await this.usersService.connectToGame(id, gameDto);
        return new UserDto(user);
    }

    @Post(':id/message')
    async addMessage(@Body() messageDto: MessageDto, @Param('id', ParseIntPipe) id: number) {
        const newMessage = await this.messageService.create(messageDto, id);
        return new MessageDto(newMessage);
    }

    @AllowAnonymous()
    @Post(':id/result')
    async addResult(@Body() resultDto: ResultDto, @Param('id', ParseIntPipe) id: number) {
        const newResult = await this.resultService.create(resultDto, id);
        return new ResultDto(newResult);
    }

    @AllowAnonymous()
    @Post(':id/resultaftergame')
    async addResultAfterGame(@Body() resultDto: UpdateResultDto, @Param('id', ParseIntPipe) id: number) {
        const newResult = await this.resultService.create(resultDto, id);
        return new ResultDto(newResult);
    }

    @Get(':id/messages')
    async getMessages(@Param('id', ParseIntPipe) id: number) {
        const messages = await this.messageService.findAll(id);
        return messages.map(message => new MessageDto(message));
    }

    @Get(':id/games')
    async getGames(@Param('id', ParseIntPipe) id: number): Promise<GameDto[]> {
        const games = await this.gamesService.findAll(id);
        return games.map(game => new GameDto(game));
    }

    @AllowAnonymous()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@UserParam() user: UserDto) {
        return {
            access_token: await this.authService.generateJwt(user),
        };
    }

    @Post('refreshtoken')
    async refreshToken(@Body() userDto: UserDto, @UserParam() actUser: UserDto) {
        const user = await this.usersService.find(userDto.id) as unknown as UserDto;
        if (actUser.id === user.id) {
            return {
                access_token: await this.authService.generateJwt(user),
            };
        } else throw new HttpException("Csak a saját tokent lehet frissíteni", HttpStatus.BAD_REQUEST);
    }

    @Patch(':id')
    async muteUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        let newUser;
        try {
            newUser = await this.usersService.update(id, updateUserDto);
        } catch (err) {
            throw new HttpException({
                message: ["Már van ilyen nevű felhasználó."]
            }, HttpStatus.BAD_REQUEST);
        }
        return new UserDto(newUser);
    }

    @AllowAnonymous()
    @Patch(':id/points')
    async updatePoints(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        const newUser = await this.usersService.updatePoints(id, updateUserDto);
        return new UserDto(newUser);
    }

    @AllowAnonymous()
    @Patch(':id/report')
    async reportUser(@Param('id', ParseIntPipe) id: number) {
        const newUser = await this.usersService.reportUser(id);
        return new UserDto(newUser);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './assets/profileimages',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async uploadFile(@UploadedFile() file, @Param('id', ParseIntPipe) userId: number): Promise<Observable<Object>> {
        const user = await this.usersService.find(userId);
        if (user.picture !== "profileimage.png" && file) {
            fs.unlink("./assets/profileimages/" + user.picture, (err => { if (err) console.log(err) }))
        }
        return of(this.usersService.updatePicture(userId, file.filename))
    }

    @AllowAnonymous()
    @Get(':id/profileimage')
    async findProfileImage(@Param('id', ParseIntPipe) userId: number, @Res() res): Promise<Observable<Object>> {
        const user = await this.usersService.find(userId);
        return of(res.sendFile(join(process.cwd(), 'assets/profileimages/' + user.picture)))
    }
}


