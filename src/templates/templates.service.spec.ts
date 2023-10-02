import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './schemas/template.schema';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let model: Model<Template>;
  const createTemplateDto: CreateTemplateDto = {
    name: 'template1',
  };

  const templatesArray = [
    {
      name: 'template1',
    },
    {
      name: 'template2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getModelToken(Template.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(templatesArray),
            }),
            create: jest.fn().mockResolvedValue(createTemplateDto),
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    model = module.get<Model<Template>>(getModelToken('Template'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all templates', async () => {
    const findSpy = jest.spyOn(model, 'find');
    const templates = await service.findAll();
    expect(findSpy).toHaveBeenCalledTimes(1); // Check if the find method was called
    expect(templates).toEqual(templatesArray);
  });

  it('should insert a new template', async () => {
    const createSpy = jest.spyOn(model, 'create');

    const createdTemplate = await service.create(createTemplateDto);
    expect(createSpy).toHaveBeenCalledTimes(1); // Check if the create method was called
    expect(createdTemplate).toEqual(1);
  });
});
