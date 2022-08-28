import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  sellerId: number;

  @IsNumber()
  buyerId: number;

  @IsNumber()
  productId: number;
}

export class createMessageDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  roomId: number;

  @IsString()
  message: string;
}
