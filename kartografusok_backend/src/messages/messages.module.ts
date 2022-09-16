import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Message } from './entities/message';
import { Game } from '../games/entities/game';
import { User } from '../users/entity/user';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Message, User, Game] }),],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
