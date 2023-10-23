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

export enum Permission {
  // Read: Allow users to view or access data.
  PS_01 = 'PS_01',

  // Write: Allow users to create, update and delete data.
  PS_O2 = 'PS_02',

  // Delete: Allow users to delete data.
  PS_O3 = 'PS_03',

  // Create: Allow users to create new data.
  PS_O4 = 'PS_04',

  // Update: Allow users to update existing data.
  PS_O5 = 'PS_05',

  // Approve: Allow users to approve data or actions.
  PS_O6 = 'PS_06',

  // Deny: Allow users to reject data or actions.
  PS_O7 = 'PS_07',

  // Grant: Allow users to grant permissions to other users.
  PS_O8 = 'PS_08',

  // Revoke: Allow users to revoke permissions from other users.
  PS_O9 = 'PS_09',

  // Config: Configure services
  PS_10 = 'PS_10',
}
