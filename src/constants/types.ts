import { Request as ERequest } from 'express';
import { Types } from 'mongoose';

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
