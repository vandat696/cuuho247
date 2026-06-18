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
import { Button } from '@/components/common/Button';

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
  const [isConnected, setIsConnected] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

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
    setIsConnected(socket.connected);

    // Join the chat room
    socket.emit('join_chat', { rescue_request_id: rescueRequestId });
    socket.emit('mark_read', { rescue_request_id: rescueRequestId });

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join_chat', { rescue_request_id: rescueRequestId });
      socket.emit('mark_read', { rescue_request_id: rescueRequestId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Listen for incoming messages
    const handleReceiveMessage = (message: IMessage) => {
      setMessages((prev) => {
        // Avoid duplicate messages (optimistic update check)
        const isDuplicate = prev.some((m) => m._id === message._id);
        if (isDuplicate) return prev;
        return [...prev, message];
      });

      // Mark as read if message is from the other party
      if (message.sender_type !== mySenderType) {
        socket.emit('mark_read', { rescue_request_id: rescueRequestId });
      }
    };
    // Listen for messages read event
    const handleMessagesRead = () => {
      // Mark all my sent messages as read
      setMessages((prev) => prev.map((msg) => (msg.sender_type === mySenderType ? { ...msg, is_read: true } : msg)));
    };
    const handleError = (err: { message: string }) => {
      const msg = err.message || 'Lỗi kết nối';
      toast.error(msg);
      if (msg.includes('quyền truy cập')) {
        setError(msg);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('error', handleError);
    };
  }, [rescueRequestId, mySenderType]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const content = inputText.trim();
    if (!content || isSending || !rescueRequestId) return;

    const socket = getSocket();
    if (!socket.connected) {
      toast.error('Mất kết nối server. Vui lòng kiểm tra lại mạng.');
      return;
    }

    setIsSending(true);
    socket.emit('send_message', { rescue_request_id: rescueRequestId, content });
    setInputText('');
    setIsSending(false);
    inputRef.current?.focus();
  }, [inputText, isSending, rescueRequestId]);

  const handleSendImage = useCallback(
    async (file: File) => {
      if (isSending || !rescueRequestId) return;

      const socket = getSocket();
      if (!socket.connected) {
        toast.error('Mất kết nối server. Vui lòng kiểm tra lại mạng.');
        return;
      }

      try {
        setIsSending(true);
        await messageService.sendImage(rescueRequestId, file);
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Không thể gửi ảnh';
        toast.error(msg);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, rescueRequestId]
  );

  const chatTitle = myRole === 'company' ? `Nhắn tin với ${customerName}` : `Nhắn tin với ${companyName}`;

  const isEnded =
    requestStatus === 'completed' ||
    requestStatus === 'cancelled' ||
    requestStatus === 'canceled' ||
    requestStatus === 'rejected';

  return (
    <MobileLayout>
      <AppHeader title={error ? 'Lỗi truy cập' : chatTitle} onBack={() => navigate(-1)} />

      {error ? (
        <div className="chat-error">
          <span className="chat-error__icon">🔒</span>
          <h2 className="chat-error__title">Từ chối truy cập</h2>
          <p className="chat-error__text">{error}</p>
          <Button variant="primary" onClick={() => navigate(-1)} sx={{ mt: 2, px: 4 }}>
            Quay lại
          </Button>
        </div>
      ) : (
        <>
          {!isConnected && (
            <div className="chat-connection-banner">
              <span className="chat-connection-banner__icon">⚠️</span>
              <span>Đang kết nối lại... Tin nhắn có thể bị gián đoạn.</span>
            </div>
          )}

          <MessageList
            messages={messages}
            isLoading={isLoading}
            mySenderType={mySenderType}
            messagesEndRef={messagesEndRef}
            onImageClick={setActiveImage}
          />

          {isEnded ? (
            <ChatEndedBanner />
          ) : (
            <MessageInput
              inputText={inputText}
              setInputText={setInputText}
              isSending={isSending}
              onSend={handleSend}
              onSendImage={handleSendImage}
              inputRef={inputRef}
            />
          )}

          {activeImage && (
            <div className="chat-image-modal" onClick={() => setActiveImage(null)}>
              <button className="chat-image-modal__close" onClick={() => setActiveImage(null)}>
                &times;
              </button>
              <img src={activeImage} alt="Hình ảnh phóng to" className="chat-image-modal__content" />
            </div>
          )}
        </>
      )}
    </MobileLayout>
  );
}
