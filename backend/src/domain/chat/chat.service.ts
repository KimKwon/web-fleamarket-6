import { HttpException, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';
import { MySQLService } from 'src/config/mysql/mysql.service';
import formatData from 'src/utils/format';
import { CreateChatDto, createMessageDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  pool: Pool;
  constructor(private readonly mysqlService: MySQLService) {
    this.pool = mysqlService.pool;
  }

  async isRoomExist(roomId: number) {
    const [result] = await this.pool.query(/*sql*/ `
      SELECT 1 FROM CHATROOM WHERE CHATROOM.id = ${roomId} AND CHATROOM.deletedAt IS NULL LIMIT 1;
    `);

    return Boolean(result[0]);
  }

  async createRoom(createChatDto: CreateChatDto) {
    const keyTemplate = Object.keys(createChatDto)
      .map((key) => key)
      .join();

    const valueTemplate = Object.values(createChatDto)
      .map((value) => value)
      .join();

    const [res] = await this.pool.query(`
      INSERT INTO CHATROOM (${keyTemplate})
      VALUES (${valueTemplate})
    `);

    const { insertId } = res as ResultSetHeader;

    return {
      roomId: insertId,
    };
  }

  async removeRoomById(roomId: number) {
    const isExist = await this.isRoomExist(roomId);
    if (!isExist) {
      throw new HttpException('Room not found.', 404);
    }

    const deletedAt = new Date().toISOString();

    const [res] = await this.pool.query(/*sql*/ `
      UPDATE CHATROOM SET deletedAt = "${deletedAt}" WHERE id = ${roomId}
    `);

    const modifedResult = res as ResultSetHeader;
    if (!modifedResult?.changedRows) {
      throw new HttpException('Nothing changed.', 422);
    }

    return {
      roomId,
    };
  }

  async checkIsRoomExist(query: any) {
    const { userId, productId } = query;

    const [res] = await this.pool.query(`
      SELECT id as roomId FROM CHATROOM
      WHERE buyerId = ${userId} AND productId = ${productId} AND deletedAt IS NULL LIMIT 1;
    `);

    return res[0];
  }

  async getChatRoomMetaInfoByRoomId(roomId: number) {
    const [res] = await this.pool.query(`
    SELECT C.id, C.buyerId, C.sellerId, C.productId, P.isSold, P.thumbnails, 
    C.updatedAt, P.price, P.name FROM CHATROOM as C
    INNER JOIN PRODUCT as P ON P.id = C.productId
    WHERE C.id = ${roomId}
  `);

    return res[0];
  }

  async getChatMessageByRoomId(roomId: number) {
    const [res] = await this.pool.query(`
      SELECT * FROM CHAT_MESSAGE
      WHERE roomId = ${roomId}
    `);

    console.log(res);
    return res;
  }

  async createChatMessage(message: createMessageDto) {
    try {
      const createdMessage = { ...message, isRead: 0 };

      const [res] = await this.mysqlService.pool.query(`
      INSERT INTO CHAT_MESSAGE (${Object.keys(createdMessage).join()})
      VALUES (${Object.values(createdMessage).map(formatData).join()})
      `);

      const { insertId } = res as ResultSetHeader;

      return insertId;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to send Message.', 500);
    }
  }

  async getChatMessageById(id: number) {
    const [res] = await this.pool.query(`
    SELECT * FROM CHAT_MESSAGE
    WHERE id = ${id}
    `);

    return res[0];
  }
}
