import { Test, TestingModule } from '@nestjs/testing';

import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsController', () => {
  let controller: FeatureFlagsController;
  let service: FeatureFlagsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureFlagsController],
      providers: [
        {
          provide: FeatureFlagsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockFeatureFlags),
          },
        },
      ],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
    controller = module.get<FeatureFlagsController>(FeatureFlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of feature flags', async () => {
      const spy = jest.spyOn(service, 'findAll');
      const flags = await controller.findAll();
      expect(flags).toBe(mockFeatureFlags);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
