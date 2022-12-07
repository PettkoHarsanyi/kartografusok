import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { PopulateHint, wrap } from '@mikro-orm/core';
import { AuthService } from 'src/auth/auth.service';
import { Division } from '../divisions/entities/division';
import { UserAuthDto } from './dto/user-auth.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { User, UserRole } from './entity/user';
import { filter } from 'rxjs';
import { DivisionDto } from '../divisions/dto/division.dto';
import { GameDto } from '../games/dto/game.dto';
import { Game } from '../games/entities/game';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,

        @InjectRepository(Division)
        private divisionRepository: EntityRepository<Division>,

        @InjectRepository(Game)
        private gameRepository: EntityRepository<Game>,

        private authService: AuthService
    ){}

    
    updateDivision(id: number, divisionDto: DivisionDto) {
        throw new Error("Method not implemented.");
    }

    async nullWeekly() {
        const users = await this.userRepository.findAll();

        users.map(user=>{
            wrap(user).assign({
                weekly: 0,
            })
        })

        await this.userRepository.persistAndFlush(users);

        return users;
    }
    
    async promotePlayers(ids: number[],up?: boolean) {

        const users = await this.userRepository.find({
            id: ids,
        });

        const maxDivId = await this.divisionRepository.count();

        users.map(user => {
            const userDivision = this.divisionRepository.getReference(user.division.id);
            let q;
            if(up){
                if(userDivision.id < maxDivId){
                    q = 1;
                }else{
                    q = 0;
                }
            }else{
                if(userDivision.id > 0){
                    q = -1;
                }else{
                    q = 0;
                }
            }
            wrap(user).assign({
                division: userDivision.id + q,
            })
        })

        await this.userRepository.persistAndFlush(users);

        return users
    }
        
    async getWeekly(howMany?: number) {
        return await this.userRepository.findAll({
            orderBy:{
                weekly: 'DESC'
            },
            limit: howMany,
            disableIdentityMap: true,
            fields: ['name','weekly',"division"],
            populate: ['division']
        })
    }

    async getAllTime() {
        return await this.userRepository.findAll({
            orderBy:{
                points: 'DESC'
            },
            disableIdentityMap: true,
            fields: ['name','points',"division"],
            populate: ['division']
        })
    }

    async find(id: number) {
        return await this.userRepository.findOne(({
            id: id,
        }),{
            populate: ['division',"games","games.messages"],
            populateWhere: {
                games: {
                    messages:{
                        user: id,
                    }
                }
            }
        })
    }
        
    async findAll() {
        return this.userRepository.findAll({
            populate: ['division','games','games.messages','messages'],
        });
    }

    async connectToGame(id: number, gameDto: GameDto){
        const user = await this.userRepository.findOne({id});
        user.games.add(this.gameRepository.getReference(gameDto.id))

        await this.userRepository.persistAndFlush(user);

        return user;
    }
    
    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({id});
        user.name = updateUserDto.name || user.name;
        user.userName = updateUserDto.userName || user.userName;
        user.banned = updateUserDto.banned || user.banned;
        user.muted = updateUserDto.muted || user.muted;
        user.email = updateUserDto.email || user.email;
        user.points = updateUserDto.points || user.points;
        user.role = updateUserDto.role || user.role;
        user.weekly = updateUserDto.weekly || user.weekly;
        user.picture = updateUserDto.picture || user.picture;
        if(updateUserDto.password){
            user.password = await this.authService.hashPassword(updateUserDto.password) || user.password;
        }
        if(updateUserDto.division){
            user.division = this.divisionRepository.getReference(updateUserDto.division.id);
        }

        await this.userRepository.persistAndFlush(user);

        return user;
    }

    async updatePoints(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({id});
        user.points = (user.points + updateUserDto.points)
        user.weekly = (user.weekly + updateUserDto.weekly)

        await this.userRepository.persistAndFlush(user);
        
        return user;
    }

    async reportUser(id: number) {
        const user = await this.userRepository.findOne({id});
        user.reports = user.reports + 1;

        await this.userRepository.persistAndFlush(user);

        return user;
    }

    async updatePicture(id: number, file: string) {
        const user = await this.userRepository.findOne({id});

        user.picture = file;

        await this.userRepository.persistAndFlush(user);

        return user;
    }
        
    async create(userAuthDto: UserAuthDto) {
        const user = new User();

        user.name = userAuthDto.name;
        user.userName = userAuthDto.userName;
        
        user.password = await this.authService.hashPassword(userAuthDto.password);

        user.points = userAuthDto.points || 0;
        user.weekly = userAuthDto.points || 0;
        user.reports = userAuthDto.reports || 0;
        
        user.role = UserRole.User;
        user.division = this.divisionRepository.getReference(1);

        await this.userRepository.persistAndFlush(user);

        return user;
    }
}
