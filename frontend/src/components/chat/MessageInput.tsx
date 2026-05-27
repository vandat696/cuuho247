import React, { RefObject, useRef } from 'react';
import toast from 'react-hot-toast';

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isSending: boolean;
  onSend: () => void;
  onSendImage: (file: File) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}

export function MessageInput({ inputText, setInputText, isSending, onSend, onSendImage, inputRef }: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dung lượng ảnh không được vượt quá 5MB');
      e.target.value = '';
      return;
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ gửi ảnh định dạng JPG, PNG hoặc WEBP');
      e.target.value = '';
      return;
    }

    onSendImage(file);
    e.target.value = '';
  };

  return (
    <div className="chat-input-area">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="chat-image-btn"
        onClick={handleImageClick}
        disabled={isSending}
        aria-label="Gửi ảnh"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      <div className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          id="chat-message-input"
          className="chat-input-field"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          autoComplete="off"
          disabled={isSending}
        />
      </div>

      <button
        id="chat-send-btn"
        type="button"
        className={`chat-send-btn ${inputText.trim() && !isSending ? 'chat-send-btn--active' : ''}`}
        onClick={onSend}
        disabled={!inputText.trim() || isSending}
        aria-label="Gửi tin nhắn"
      >
        {isSending ? (
          <div className="chat-send-btn__spinner" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
