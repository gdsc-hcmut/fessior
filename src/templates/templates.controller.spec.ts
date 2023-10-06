import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

describe('Template Controller', () => {
  let controller: TemplatesController;
  let service: TemplatesService;
  const createTemplateDto: CreateTemplateDto = {
    name: 'template',
  };

  const mockTemplate = {
    name: 'template',
    _id: 'template id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        { provide: JwtService, useValue: {} },
        {
          provide: TemplatesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'template1',
              },
              {
                name: 'template2',
              },
              {
                name: 'template3',
              },
            ]),
            create: jest.fn().mockResolvedValue(createTemplateDto),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
    service = module.get<TemplatesService>(TemplatesService);
  });

  describe('create()', () => {
    it('should create a new template', async () => {
      const createSpy = jest.spyOn(service, 'create').mockResolvedValueOnce(mockTemplate);

      await controller.create(createTemplateDto);
      expect(createSpy).toHaveBeenCalledWith(createTemplateDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of templates', async () => {
      const createSpy = jest.spyOn(service, 'findAll');

      await expect(controller.findAll()).resolves.toEqual({
        payload: [
          {
            name: 'template1',
          },
          {
            name: 'template2',
          },
          {
            name: 'template3',
          },
        ],
      });
      expect(createSpy).toHaveBeenCalled();
    });
  });
});
