import { Test, TestingModule } from '@nestjs/testing';

import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

describe('Users Controller', () => {
  let controller: TemplatesController;
  let service: TemplatesService;
  const createUserDto: CreateTemplateDto = {
    email: 'lygioian@gmail.com',
    name: 'Ly Gioi An',
  };

  const mockUser = {
    email: 'lygioian@gmail.com',
    name: 'Ly Gioi An',
    _id: 'a id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                email: 'lygioian1@gmail.com',
                name: 'Ly Gioi An1',
              },
              {
                email: 'lygioian2@gmail.com',
                name: 'Ly Gioi An2',
              },
              {
                email: 'lygioian3@gmail.com',
                name: 'Ly Gioi An3',
              },
            ]),
            create: jest.fn().mockResolvedValue(createUserDto),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
    service = module.get<TemplatesService>(TemplatesService);
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const createSpy = jest.spyOn(service, 'create').mockResolvedValueOnce(mockUser);

      await controller.create(createUserDto);
      expect(createSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        {
          email: 'lygioian1@gmail.com',
          name: 'Ly Gioi An1',
        },
        {
          email: 'lygioian2@gmail.com',
          name: 'Ly Gioi An2',
        },
        {
          email: 'lygioian3@gmail.com',
          name: 'Ly Gioi An3',
        },
      ]);
      expect(service.findAll.bind(service)).toHaveBeenCalled();
    });
  });
});
