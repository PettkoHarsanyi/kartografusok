import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Message } from './entities/message';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Message] })],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
