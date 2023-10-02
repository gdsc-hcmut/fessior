import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag } from './schemas/feature-flag.schema';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;
  let model: Model<FeatureFlag>;

  const mockFeatureFlags = [
    {
      name: 'feature flag 1',
      key: 'feature_flag_1',
      description: 'feature flag 1 description',
    },
    {
      name: 'feature flag 2',
      key: 'feature_flag_2',
      description: 'feature flag 2 description',
    },
    {
      name: 'feature flag 3',
      key: 'feature_flag_3',
      description: 'feature flag 3 description',
    },
  ];
  const createFeatureFlagDto: CreateFeatureFlagDto = {
    name: 'feature flag 1',
    key: 'ff1',
    description: 'desc',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagsService,
        {
          provide: getModelToken(FeatureFlag.name),
          useValue: {
            find: jest.fn().mockReturnValue(mockFeatureFlags),
            create: jest.fn().mockReturnValue(createFeatureFlagDto),
          },
        },
      ],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
    model = module.get<Model<FeatureFlag>>(getModelToken(FeatureFlag.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of feature flags', async () => {
    const spy = jest.spyOn(model, 'find');
    const flags = await service.findAll();
    expect(flags).toEqual(mockFeatureFlags);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith();
  });

  it('should create a new feature flag', async () => {
    const spy = jest.spyOn(model, 'create');
    const flag = await service.create(createFeatureFlagDto);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(createFeatureFlagDto);
    expect(flag).toEqual(createFeatureFlagDto);
  });
});
