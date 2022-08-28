import socketEvent from 'src/constants/socketEvent';
import {
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

export interface ChatRoomInfo {
  roomId: string;
  seller: string;
  buyer: string;
}

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private chatRooms: Record<string, ChatRoomInfo>;
  constructor(private readonly chatService: ChatService) {
    this.chatRooms = {};
  }
  @WebSocketServer()
  server: Server;

  // 소켓에는 들어왔지만 chatRoom에는 안 들어 온 상태입니다.
  public handleConnection(client: Socket) {
    console.log('웹소켓이 연결되었음...');
    console.log(client.id + '가 접속했어요.');
    client.leave(client.id);
  }

  public handleDisconnect(client: Socket) {
    console.log('웹소켓 연결 종료되었음');
    console.log(client.id + '가 떠났어요.');

    console.log('-----------------------------------');
    client.leave(client.data.roomId);
  }

  @SubscribeMessage(socketEvent.ENTER)
  enterChatRoom(client: Socket, roomInfo: ChatRoomInfo) {
    const { roomId } = roomInfo;
    this.chatRooms[roomId] = {
      ...roomInfo,
    };

    client.data.roomId = roomId;
    client.join(roomId);
  }

  @SubscribeMessage(socketEvent.SEND)
  async sendMessage(
    client: Socket,
    { message, senderId }: { message: string; senderId: number },
  ) {
    const roomId = client.data.roomId;
    const createdChatMessage = {
      message,
      senderId,
      roomId: Number(roomId),
    };

    const id = await this.chatService.createChatMessage(createdChatMessage);
    const newMessage = await this.chatService.getChatMessageById(id);

    client.to(roomId).emit(socketEvent.RECEIVE, {
      ...newMessage,
    });
  }
}
