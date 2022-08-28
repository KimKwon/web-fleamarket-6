import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MySQLModule } from 'src/config/mysql/mysql.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [MySQLModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
