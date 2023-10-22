import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

const mockUser: User = {
  email: 'lygioian@gmail.com',
  firstName: 'Gioi An',
  appleId: 'appleId',
  googleId: 'googleId',
  lastName: 'Ly',
  picture: 'picture',
  dateOfBirth: 'dateOfBirth',
  phone: 'phone',
  createdAt: new Date(),
  updatedAt: new Date(),
  isManager: false,
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const usersArray = [
    {
      email: 'lygioian1@gmail.com',
      firstName: 'Gioi An',
      appleId: 'appleId',
      googleId: 'googleId',
      lastName: 'Ly',
      picture: 'picture',
      dateOfBirth: 'dateOfBirth',
      phone: 'phone',
      createdAt: new Date(),
      updatedAt: new Date(),
      isManager: false,
    },
    {
      email: 'lygioian2@gmail.com',
      firstName: 'Gioi An',
      appleId: 'appleId',
      googleId: 'googleId',
      lastName: 'Ly',
      picture: 'picture',
      dateOfBirth: 'dateOfBirth',
      phone: 'phone',
      createdAt: new Date(),
      updatedAt: new Date(),
      isManager: false,
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
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(usersArray),
            }),
            create: jest.fn().mockImplementation((data: User) => data),
            findAll: jest.fn().mockResolvedValue(usersArray),
            sort: jest.fn().mockResolvedValue(usersArray),
            skip: jest.fn().mockResolvedValue(usersArray),
            limit: jest.fn().mockResolvedValue(usersArray),
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

  // it('should return all users', async () => {
  //   const spy1 = jest.spyOn(model, 'find');
  // const spy2 = jest.spyOn(model, 'sort');
  // const spy3 = jest.spyOn(model, 'offset');
  // const spy4 = jest.spyOn(model, 'limit');

  //   const users = await service.findAll(10, 0, SortOption.DESC);
  //   expect(spy1).toHaveBeenCalledTimes(1); // Check if the find method was called
  //   expect(users).toEqual(usersArray);
  // });

  it('should insert a new user', async () => {
    const createSpy = jest.spyOn(model, 'create');
    const newUser: User = {
      email: 'lygioian@gmail.com',
      firstName: 'Gioi An',
      appleId: 'appleId',
      googleId: 'googleId',
      lastName: 'Ly',
      picture: 'picture',
      dateOfBirth: 'dateOfBirth',
      phone: 'phone',
      createdAt: new Date(),
      updatedAt: new Date(),
      isManager: false,
    };
    const createdUser = await service.create(newUser);
    expect(createSpy).toHaveBeenCalledTimes(1); // Check if the create method was called
    expect(createdUser).toEqual(newUser);
  });
});
