import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

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
            create: jest.fn(),
            exec: jest.fn(),
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
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersArray),
    } as any);
    const cats = await service.findAll();
    expect(cats).toEqual(usersArray);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        email: 'lygioian@gmail.com',
        name: 'Ly Gioi An',
      } as any),
    );
    const newUser = await service.create({
      email: 'lygioian@gmail.com',
      name: 'Ly Gioi An',
    });
    expect(newUser).toEqual(mockUser);
  });
});
