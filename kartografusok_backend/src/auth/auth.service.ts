import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { UserAuthDto } from 'src/users/dto/user-auth.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user';
import { promisify } from 'util';
import { pbkdf2 } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private userRepository: EntityRepository<User>
    ){}

    async getUserByUserNameAndPassword(userAuthDto: UserAuthDto): Promise<UserDto>{
        const password = await this.hashPassword(userAuthDto.password);
        const user = await this.userRepository.findOne({
            userName: userAuthDto.userName,
            password: password,
        });
        if(user){
            return new UserDto(user);
        }
        return null;
    }

    async hashPassword(password: string) {
        const hash = await promisify(pbkdf2)(
          password,
          'cica',
          10000,
          64,
          'sha512',
        );
        return hash.toString('hex');
      }
}
