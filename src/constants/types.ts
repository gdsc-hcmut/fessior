import { Request as ERequest } from 'express';
import { Types } from 'mongoose';

import { CreateAccessLevelDto } from '../access-levels/dto/create-access-level.dto';
import { CreateFeatureFlagDto } from '../feature-flags/dto/create-feature-flag.dto';
import { CreateOrganizationDto } from '../organization/dto/create-organization.dto';
import { CreateUrlDto } from '../urls/dto/create-url.dto';

export type ControllerResponse<T> = {
  payload: T;
  message?: string;
};

export interface Request extends ERequest {
  tokenMeta: { userId: Types.ObjectId };
}

export enum SortOption {
  DATE = 'date',
  DESC = 'desc',
  ASC = 'asc',
}

export enum Platform {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
}

export enum FlagName {
  GET_ME = 'GET_ME',
  GET_ALL_USERS = 'GET_ALL_USERS',
  GET_USER_BY_ID = 'GET_USER_BY_ID',
}

export enum Permission {
  READ_ALL_USERS = 'READ_ALL_USERS',
  READ_USER_BY_ID = 'READ_USER_BY_ID',
  DELETE_USER_BY_ID = 'DELETE_USER_BY_ID',
}

export enum Origin {
  MESSENGER = 'Messenger',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TWITTER = 'Twitter',
  LINKEDIN = 'Linkedin',
  YOUTUBE = 'Youtube',
}

export enum Referer {
  MESSENGER = 'https://l.messenger.com/',
  FACEBOOK = 'https://l.facebook.com/',
  INSTAGRAM = 'https://l.instagram.com/',
  TWITTER = 'https://t.co/',
  LINKEDIN = 'https://www.linkedin.com/',
  YOUTUBE = 'https://www.youtube.com/',
}

export type CreateDto = CreateAccessLevelDto | CreateFeatureFlagDto | CreateOrganizationDto | CreateUrlDto;

export enum UrlSortOption {
  TIME = 'time',
  CLICKS = 'clicks',
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}
