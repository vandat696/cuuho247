import { EventEmitter } from 'events';

export const messageEventEmitter = new EventEmitter();

export const MESSAGE_EVENTS = {
  MESSAGE_SENT: 'message:sent',
};
