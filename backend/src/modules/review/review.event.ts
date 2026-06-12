import { EventEmitter } from 'events';

export const reviewEventEmitter = new EventEmitter();

export const REVIEW_EVENTS = {
  REVIEW_SUBMITTED: 'review:submitted',
  REVIEW_REPLIED: 'review:replied',
};
