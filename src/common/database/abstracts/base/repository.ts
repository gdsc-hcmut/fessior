import { UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';

import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseCreateManyOptions,
  IDatabaseManyOptions,
  IDatabaseSoftDeleteManyOptions,
  IDatabaseRestoreManyOptions,
  IDatabaseRawOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
  IDatabaseFindOneLockOptions,
  IDatabaseRawFindAllOptions,
  IDatabaseRawGetTotalOptions,
} from '../../interfaces';

export abstract class DatabaseBaseRepositoryAbstract<Entity = any> {
  abstract findAll<T = Entity>(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<T[]>;

  abstract findAllDistinct<T = Entity>(
    fieldDistinct: string,
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<T[]>;

  abstract findOne<T = Entity>(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T>;

  abstract findOneById<T = Entity>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;

  abstract findOneAndLock<T = Entity>(find: Record<string, any>, options?: IDatabaseFindOneLockOptions): Promise<T>;

  abstract findOneByIdAndLock<T = Entity>(_id: string, options?: IDatabaseFindOneLockOptions): Promise<T>;

  abstract getTotal(find?: Record<string, any>, options?: IDatabaseGetTotalOptions): Promise<number>;

  abstract exists(find: Record<string, any>, options?: IDatabaseExistOptions): Promise<boolean>;

  abstract create<Dto = any>(data: Dto, options?: IDatabaseCreateOptions): Promise<Entity>;

  abstract save(repository: Entity, options?: IDatabaseSaveOptions): Promise<Entity>;

  abstract delete(repository: Entity, options?: IDatabaseSaveOptions): Promise<Entity>;

  abstract softDelete(repository: Entity, options?: IDatabaseSaveOptions): Promise<Entity>;

  abstract restore(repository: Entity, options?: IDatabaseSaveOptions): Promise<Entity>;

  abstract createMany<Dto>(data: Dto[], options?: IDatabaseCreateManyOptions): Promise<boolean>;

  abstract deleteManyByIds(_id: string[], options?: IDatabaseManyOptions): Promise<boolean>;

  abstract deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean>;

  abstract softDeleteManyByIds(_id: string[], options?: IDatabaseSoftDeleteManyOptions): Promise<boolean>;

  abstract softDeleteMany(find: Record<string, any>, options?: IDatabaseSoftDeleteManyOptions): Promise<boolean>;

  abstract restoreManyByIds(_id: string[], options?: IDatabaseRestoreManyOptions): Promise<boolean>;

  abstract restoreMany(find: Record<string, any>, options?: IDatabaseRestoreManyOptions): Promise<boolean>;

  abstract updateMany<Dto>(find: Record<string, any>, data: Dto, options?: IDatabaseManyOptions): Promise<boolean>;

  abstract updateManyRaw(
    find: Record<string, any>,
    data: UpdateWithAggregationPipeline | UpdateQuery<any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean>;

  abstract raw<RawResponse, RawQuery = any>(
    rawOperation: RawQuery,
    options?: IDatabaseRawOptions,
  ): Promise<RawResponse[]>;

  abstract rawFindAll<RawResponse, RawQuery = any>(
    rawOperation: RawQuery,
    options?: IDatabaseRawFindAllOptions,
  ): Promise<RawResponse[]>;

  abstract rawGetTotal<RawQuery = any>(rawOperation: RawQuery, options?: IDatabaseRawGetTotalOptions): Promise<number>;

  abstract model(): Promise<any>;
}
