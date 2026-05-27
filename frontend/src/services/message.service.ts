import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { IChatHistory, IMessage } from '../types/message.type';

export const messageService = {
  /**
   * Fetch message history for a rescue request
   */
  getMessages: async (rescueRequestId: string): Promise<ApiResponse<IChatHistory>> => {
    const response = await http.get<ApiResponse<IChatHistory>>(`/messages/${rescueRequestId}`);
    return response.data;
  },

  /**
   * Upload and send an image in chat
   */
  sendImage: async (rescueRequestId: string, file: File): Promise<ApiResponse<IMessage>> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await http.post<ApiResponse<IMessage>>(`/messages/${rescueRequestId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
