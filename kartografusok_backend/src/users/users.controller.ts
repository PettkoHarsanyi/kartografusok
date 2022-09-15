import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Controller, Body, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserParam } from 'src/auth/user-param.decorator';
import { UserAuthDto } from './dto/user-auth.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService){

    }

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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@UserParam() user: UserDto){
        return user;
    }
}

