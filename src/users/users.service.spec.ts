import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

const mockUser = {
  email: 'lygioian@gmail.com',
  name: 'Ly Gioi An',
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

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
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn().mockImplementation((data: User) => data),
            exec: jest.fn().mockResolvedValueOnce(usersArray),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
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
    const newUser: User = {
      email: 'lygioian@gmail.com',
      name: 'Ly Gioi An',
    };
    const createdUser = await service.create(newUser);
    expect(createSpy).toHaveBeenCalledTimes(1); // Check if the create method was called
    expect(createdUser).toEqual(newUser);
  });
});
