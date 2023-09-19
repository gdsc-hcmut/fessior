import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { Template } from './schemas/template.schema';
import { TemplatesService } from './templates.service';

const mockUser = {
  email: 'lygioian@gmail.com',
  name: 'Ly Gioi An',
};

describe('UsersService', () => {
  let service: TemplatesService;
  let model: Model<Template>;

  const usersArray = [
    {
      email: 'lygioian@gmail.com',
      name: 'Ly Gioi An',
    },
    {
      email: 'lygioian2@gmail.com',
      name: 'Ly Gioi An2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn().mockImplementation((data: Template) => data),
            exec: jest.fn().mockResolvedValueOnce(usersArray),
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    model = module.get<Model<Template>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const findSpy = jest.spyOn(model, 'find');
    const users = await service.findAll();
    expect(findSpy).toHaveBeenCalledTimes(1); // Check if the find method was called
    expect(users).toEqual(usersArray);
  });

  it('should insert a new user', async () => {
    const createSpy = jest.spyOn(model, 'create');
    const newUser: Template = {
      email: 'lygioian@gmail.com',
      name: 'Ly Gioi An',
    };
    const createdUser = await service.create(newUser);
    expect(createSpy).toHaveBeenCalledTimes(1); // Check if the create method was called
    expect(createdUser).toEqual(newUser);
  });
});
