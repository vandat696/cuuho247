import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { messageService } from '@/services/message.service';
import { getSocket } from '@/utils/socket';
import { IMessage } from '@/types/message.type';
import toast from 'react-hot-toast';

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { rescueRequestId } = useParams<{ rescueRequestId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [companyName, setCompanyName] = useState('Cứu hộ 247');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Determine current user's sender_type from local storage role
  const myRole = localStorage.getItem('role') || 'user'; // 'user' | 'company'
  const mySenderType: 'user' | 'company' = myRole === 'company' ? 'company' : 'user';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load initial message history
  useEffect(() => {
    if (!rescueRequestId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await messageService.getMessages(rescueRequestId);
        if (response.status === 'success' && response.data) {
          setMessages(response.data.messages);
          if (response.data.rescue_request?.company_name) {
            setCompanyName(response.data.rescue_request.company_name);
          }
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Không thể tải tin nhắn';
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [rescueRequestId]);

  // Setup socket connection and listeners
  useEffect(() => {
    if (!rescueRequestId) return;

    const socket = getSocket();

    // Join the chat room
    socket.emit('join_chat', { rescue_request_id: rescueRequestId });

    // Listen for incoming messages
    const handleReceiveMessage = (message: IMessage) => {
      setMessages((prev) => {
        // Avoid duplicate messages (optimistic update check)
        const isDuplicate = prev.some((m) => m._id === message._id);
        if (isDuplicate) return prev;
        return [...prev, message];
      });
    };

    const handleError = (err: { message: string }) => {
      toast.error(err.message || 'Lỗi kết nối');
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('error', handleError);

    // Mark messages as read when entering the chat
    socket.emit('mark_read', { rescue_request_id: rescueRequestId });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('error', handleError);
    };
  }, [rescueRequestId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const content = inputText.trim();
    if (!content || isSending || !rescueRequestId) return;

    setIsSending(true);
    const socket = getSocket();
    socket.emit('send_message', { rescue_request_id: rescueRequestId, content });
    setInputText('');
    setIsSending(false);
    inputRef.current?.focus();
  }, [inputText, isSending, rescueRequestId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatTitle = myRole === 'company' ? 'Nhắn tin với khách hàng' : `Nhắn tin với ${companyName}`;

  return (
    <MobileLayout>
      <AppHeader title={chatTitle} onBack={() => navigate(-1)} />

      {/* Message List */}
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
            return (
              <div key={msg._id} className={`chat-message-row ${isMine ? 'chat-message-row--mine' : ''}`}>
                <div className={`chat-bubble ${isMine ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
                  <p className="chat-bubble__text">{msg.content}</p>
                  <span className="chat-bubble__time">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
          onClick={handleSend}
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
    </MobileLayout>
  );
}
