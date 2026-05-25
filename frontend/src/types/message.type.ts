export interface IMessage {
  _id: string;
  rescue_request_id: string;
  sender_type: 'user' | 'company';
  sender_id: string;
  content: string;
  content_type?: 'text' | 'image';
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IChatHistory {
  messages: IMessage[];
  rescue_request: {
    _id: string;
    company_name?: string;
    customer_name?: string;
    status?: string;
  };
}
