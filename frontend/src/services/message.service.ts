import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { IChatHistory } from '../types/message.type';

export const messageService = {
  /**
   * Fetch message history for a rescue request
   */
  getMessages: async (rescueRequestId: string): Promise<ApiResponse<IChatHistory>> => {
    const response = await http.get<ApiResponse<IChatHistory>>(`/messages/${rescueRequestId}`);
    return response.data;
  },
};
