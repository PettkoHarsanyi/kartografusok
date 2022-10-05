import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';
import { AuthService } from 'src/auth/auth.service';
import { Division } from '../divisions/entities/division';
import { UserAuthDto } from './dto/user-auth.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { User, UserRole } from './entity/user';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,

        @InjectRepository(Division)
        private divisionRepository: EntityRepository<Division>,

        private authService: AuthService
    ){}

    
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
        return await this.userRepository.findOne(id)
    }
        
    async findAll() {
        return this.userRepository.findAll({
            populate: ['division'],
            disableIdentityMap: true,
        });
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

        await this.userRepository.persistAndFlush(user);

        return user;
    }
        
    async create(userAuthDto: UserAuthDto) {
        const user = new User();

        user.name = userAuthDto.name;
        user.userName = userAuthDto.userName;
        
        user.password = await this.authService.hashPassword(userAuthDto.password);
        user.role = UserRole.User;
        user.division = this.divisionRepository.getReference(1);

        await this.userRepository.persistAndFlush(user);

        return user;
    }
}
