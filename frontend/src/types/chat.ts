export interface ChatRoomInfo {
  messages: MessageType[];
  roomInfo: {
    sellerId: number;
    buyerId: number;
    isSold: boolean;
    thumbnails: string[];
    updatedAt: string;
    id: number; // 방 아이디
    price: number; //상품 가격
    name: string; // 상품이름
    productId: number;
  };
}

export interface MessageType {
  id: number;
  senderId: number;
  roomId: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}
