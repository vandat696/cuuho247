import React, { RefObject } from 'react';

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isSending: boolean;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}

export function MessageInput({ inputText, setInputText, isSending, onSend, inputRef }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-area">
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
        />
      </div>
      <button
        id="chat-send-btn"
        type="button"
        className={`chat-send-btn ${inputText.trim() ? 'chat-send-btn--active' : ''}`}
        onClick={onSend}
        disabled={!inputText.trim() || isSending}
        aria-label="Gửi tin nhắn"
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
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
