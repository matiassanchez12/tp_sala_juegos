export interface IChatMessage {
    id: string;
    content: string;
    receiver_id: string;
    sender_id: string;
    timestamp: Date;
  }
  