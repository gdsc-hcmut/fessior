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
