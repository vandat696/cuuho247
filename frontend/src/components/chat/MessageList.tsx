import { RefObject } from 'react';
import { IMessage } from '@/types/message.type';

interface MessageListProps {
  messages: IMessage[];
  isLoading: boolean;
  mySenderType: 'user' | 'company';
  messagesEndRef: RefObject<HTMLDivElement>;
  onImageClick?: (url: string) => void;
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function MessageList({ messages, isLoading, mySenderType, messagesEndRef, onImageClick }: MessageListProps) {
  return (
    <div className="chat-messages-area">
      {isLoading ? (
        <div className="chat-loading">
          <div className="chat-loading__spinner" />
          <span>Đang tải tin nhắn...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="chat-empty">
          <span className="chat-empty__icon">💬</span>
          <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMine = msg.sender_type === mySenderType;
          const isImage = msg.content_type === 'image';
          return (
            <div key={msg._id} className={`chat-message-row ${isMine ? 'chat-message-row--mine' : ''}`}>
              <div
                className={`chat-bubble ${isImage ? 'chat-bubble--image' : ''} ${
                  isMine ? 'chat-bubble--mine' : 'chat-bubble--theirs'
                }`}
              >
                {isImage ? (
                  <img
                    src={msg.content}
                    alt="Ảnh đính kèm"
                    className="chat-bubble__img"
                    onClick={() => onImageClick && onImageClick(msg.content)}
                  />
                ) : (
                  <p className="chat-bubble__text">{msg.content}</p>
                )}
                <div className="chat-bubble__meta">
                  <span className="chat-bubble__time">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
