import { InjectConnection, InjectModel, Schema, SchemaOptions } from '@nestjs/mongoose';
import {
  DATABASE_CONNECTION_NAME,
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from 'src/common/database/constants';

export function DatabaseConnection(connectionName?: string): ParameterDecorator {
  return InjectConnection(connectionName ?? DATABASE_CONNECTION_NAME);
}

export function DatabaseModel(entity: any, connectionName?: string): ParameterDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return InjectModel(entity, connectionName ?? DATABASE_CONNECTION_NAME);
}

export function DatabaseEntity(options?: SchemaOptions): ClassDecorator {
  return Schema({
    ...options,
    versionKey: false,
    timestamps: {
      createdAt: DATABASE_CREATED_AT_FIELD_NAME,
      updatedAt: DATABASE_UPDATED_AT_FIELD_NAME,
    },
  });
}
