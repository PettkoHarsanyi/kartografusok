import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Game } from '../games/entities/game';
import { User } from '../users/entity/user';
import { MessageDto } from './dto/message.dto';
import { Message } from './entities/message';

@Injectable()
export class MessagesService {
  
  constructor(
    @InjectRepository(Message)
        private messageRepository: EntityRepository<Message>,
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    @InjectRepository(Game)
    private gameRepository: EntityRepository<Game>
  ){}

  async create(messageDto: MessageDto, userId?: number) {
    const message = new Message();

    message.user = this.usersRepository.getReference(userId);
    message.message = messageDto.message;
    await this.messageRepository.persistAndFlush(message);

    return message;
  }

  async findAll(userId?: number) {
    if(userId){
      return this.messageRepository.find({
        user: userId,
      },{
        fields: ['user','user.name','message']
      });
    }else{
      return this.messageRepository.findAll({
        fields: ['user','user.name','message']
      })
    }
  }

  findAllOfGame(id: number) {
    return this.messageRepository.find({
      game: id
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, messageDto: MessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
