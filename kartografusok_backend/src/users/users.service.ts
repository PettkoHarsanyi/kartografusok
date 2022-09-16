import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { User, UserRole } from './entity/user';

@Injectable()
export class UsersService {
    
    
    constructor(
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,
        private authService: AuthService
    ){}

    async find(id: number) {
        return await this.userRepository.findOne(id)
    }
        
    async findAll() {
        return this.userRepository.findAll();
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

        await this.userRepository.persistAndFlush(user);

        return user;
    }
}
