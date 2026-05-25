import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { messageService } from '@/services/message.service';
import { getSocket } from '@/utils/socket';
import { IMessage } from '@/types/message.type';
import toast from 'react-hot-toast';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { ChatEndedBanner } from '@/components/chat/ChatEndedBanner';

export default function ChatPage() {
  const { rescueRequestId } = useParams<{ rescueRequestId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [companyName, setCompanyName] = useState('Cứu hộ 247');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('Khách hàng');
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
        const response = await messageService.getMessages(rescueRequestId);
        if (response.status === 'success' && response.data) {
          setMessages(response.data.messages);
          if (response.data.rescue_request?.company_name) {
            setCompanyName(response.data.rescue_request.company_name);
          }
          if (response.data.rescue_request?.customer_name) {
            setCustomerName(response.data.rescue_request.customer_name);
          }
          if (response.data.rescue_request?.status) {
            setRequestStatus(response.data.rescue_request.status);
          }
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Không thể tải tin nhắn';
        setError(msg);
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
      const msg = err.message || 'Lỗi kết nối';
      toast.error(msg);
      if (msg.includes('quyền truy cập')) {
        setError(msg);
      }
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

  const chatTitle = myRole === 'company' ? `Nhắn tin với ${customerName}` : `Nhắn tin với ${companyName}`;

  const isEnded = requestStatus === 'completed' || requestStatus === 'cancelled' || requestStatus === 'rejected';

  return (
    <MobileLayout>
      <AppHeader title={error ? 'Lỗi truy cập' : chatTitle} onBack={() => navigate(-1)} />

      {error ? (
        <div className="chat-error">
          <span className="chat-error__icon">🔒</span>
          <h2 className="chat-error__title">Từ chối truy cập</h2>
          <p className="chat-error__text">{error}</p>
          <button className="chat-error__btn" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      ) : (
        <>
          <MessageList
            messages={messages}
            isLoading={isLoading}
            mySenderType={mySenderType}
            messagesEndRef={messagesEndRef}
          />

          {isEnded ? (
            <ChatEndedBanner />
          ) : (
            <MessageInput
              inputText={inputText}
              setInputText={setInputText}
              isSending={isSending}
              onSend={handleSend}
              inputRef={inputRef}
            />
          )}
        </>
      )}
    </MobileLayout>
  );
}
