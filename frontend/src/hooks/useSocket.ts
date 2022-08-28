import { useEffect, useRef, useState } from 'react';
import * as io from 'socket.io-client';
import socketEvent from '../constants/socketEvent';
import { ChatRoomInfo, MessageType } from '../types/chat';

interface SendMessage {
  message: string;
  senderId: number;
}

function useSocket(chatRoomInfo: ChatRoomInfo | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [receivedData, setReceivedData] = useState<MessageType[]>([]);
  const socket = useRef<io.Socket>();

  const sendMessage = ({ message, senderId }: SendMessage) => {
    if (!socket.current || !chatRoomInfo) return;

    socket.current.emit(socketEvent.SEND, {
      message,
      senderId,
      roomId: chatRoomInfo.roomInfo.id,
    });
  };

  const receiveMessage = (socket: io.Socket) => {
    socket.on(socketEvent.RECEIVE, (info: MessageType) => {
      setReceivedData((prev) => [...prev, info]);
    });
  };

  useEffect(() => {
    socket.current = io.connect('http://localhost:8080');
  }, []);

  useEffect(() => {
    if (!socket.current || !chatRoomInfo) return;

    const { sellerId, buyerId, id: roomId } = chatRoomInfo.roomInfo;

    socket.current.emit(socketEvent.ENTER, {
      sellerId,
      buyerId,
      roomId,
    });
    setIsLoading(false);
    setReceivedData(chatRoomInfo.messages);

    receiveMessage(socket.current);
  }, [chatRoomInfo]);

  return { isLoading, sendMessage, receivedData };
}

export default useSocket;
