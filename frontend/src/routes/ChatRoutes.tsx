import React from 'react';
import { Routes, Route } from 'react-router-dom';

const ChatPage = React.lazy(() => import('@/pages/chat/ChatPage'));

export function ChatRoutes() {
  return (
    <Routes>
      <Route path=":rescueRequestId" element={<ChatPage />} />
    </Routes>
  );
}
export default ChatRoutes;
