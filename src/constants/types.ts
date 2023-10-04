import { Request as ERequest } from 'express';
import { TokenPayload as ETokenPayload } from 'google-auth-library';
import { Types } from 'mongoose';

export type ControllerResponse<T> = {
  payload: T;
  message?: string;
};

export interface Request extends ERequest {
  tokenMeta: { userId: Types.ObjectId };
}

export interface TokenPayload extends ETokenPayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}
