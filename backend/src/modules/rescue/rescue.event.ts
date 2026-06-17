import { EventEmitter } from 'events';

export const rescueEventEmitter = new EventEmitter();

export const RESCUE_EVENTS = {
  REQUEST_CREATED: 'request:created',
  REQUEST_ACCEPTED: 'request:accepted',
  REQUEST_IN_PROGRESS: 'request:in_progress',
  REQUEST_ARRIVED: 'request:arrived',
  REQUEST_COMPLETED: 'request:completed',
  REQUEST_CANCELLED: 'request:cancelled',
  REQUEST_REJECTED: 'request:rejected',
};
