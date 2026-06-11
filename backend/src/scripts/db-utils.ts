import * as Models from '../shared/models';

export interface ModelToClean {
  name: string;
  model: any;
}

export const getModelsToClean = (): ModelToClean[] => [
  { name: 'User', model: Models.User },
  { name: 'Company', model: Models.Company },
  { name: 'Admin', model: Models.Admin },
  { name: 'ServiceCategory', model: Models.ServiceCategory },
  { name: 'Service', model: Models.Service },
  { name: 'Vehicle', model: Models.Vehicle },
  { name: 'RescueRequest', model: Models.RescueRequest },
  { name: 'Message', model: Models.Message },
  { name: 'Review', model: Models.Review },
  { name: 'Notification', model: Models.Notification },
  { name: 'CommunityPost', model: Models.CommunityPost },
  { name: 'CommunityPostComment', model: Models.CommunityPostComment },
  { name: 'CommunityPostLike', model: Models.CommunityPostLike },
  { name: 'AdminLog', model: Models.AdminLog },
];
