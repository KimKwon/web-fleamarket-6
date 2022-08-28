import { IsOptional, IsString } from 'class-validator';

export type ChatRoomFilterType = {
  userId: number;
  productId?: number;
};

export class ChatRoomsGetOptions {
  @IsString()
  @IsOptional()
  filter?: ChatRoomFilterType;
}
