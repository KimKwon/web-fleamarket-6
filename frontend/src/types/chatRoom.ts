export interface ChatRoom {
  id: number;
  buyer: number;
  sellerId: number;
  buyerName: string;
  sellerName: string;
  thumbnails: string[];
  lastChatMessage: string;
}
