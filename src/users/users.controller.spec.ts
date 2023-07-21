import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;
  const createUserDto: CreateUserDto = {
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
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
