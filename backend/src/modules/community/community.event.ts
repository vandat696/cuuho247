import { EventEmitter } from 'events';

export const communityEventEmitter = new EventEmitter();

export const COMMUNITY_EVENTS = {
  COMMENT_ADDED: 'community:comment_added',
};
