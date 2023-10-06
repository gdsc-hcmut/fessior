describe('Users Controller', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
  // let controller: UsersController;
  // let service: UsersService;
  // const createUserDto: CreateUserDto = {
  //   email: 'lygioian@gmail.com',
  //   firstName: 'Gioi An',
  //   appleId: 'appleId',
  //   googleId: 'googleId',
  //   lastName: 'Ly',
  //   picture: 'picture',
  //   dateOfBirth: 'dateOfBirth',
  //   phone: 'phone',
  //   isManager: false,
  // };
  // const mockUser: User = {
  //   email: 'lygioian2@gmail.com',
  //   firstName: 'Gioi An',
  //   appleId: 'appleId',
  //   googleId: 'googleId',
  //   lastName: 'Ly',
  //   picture: 'picture',
  //   dateOfBirth: 'dateOfBirth',
  //   phone: 'phone',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   isManager: false,
  // };
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UsersController],
  //     providers: [
  //       {
  //         provide: UsersService,
  //         useValue: {
  //           findAll: jest.fn().mockResolvedValue([
  //             {
  //               email: 'lygioian1@gmail.com',
  //               name: 'Ly Gioi An1',
  //             },
  //             {
  //               email: 'lygioian2@gmail.com',
  //               name: 'Ly Gioi An2',
  //             },
  //             {
  //               email: 'lygioian3@gmail.com',
  //               name: 'Ly Gioi An3',
  //             },
  //           ]),
  //           // create: jest.fn().mockResolvedValue(createUserDto),
  //         },
  //       },
  //     ],
  //   }).compile();
  // controller = module.get<UsersController>(UsersController);
  // service = module.get<UsersService>(UsersService);
  // });
  // describe('create()', () => {
  //   it('should create a new user', async () => {
  //     const createSpy = jest.spyOn(service, 'create');
  //     // await controller.create(createUserDto);
  //     expect(createSpy).toHaveBeenCalledWith(createUserDto);
  //   });
  // });
  // describe('findAll()', () => {
  //   it('should return an array of users', async () => {
  //     const spy = jest.spyOn(service, 'findAll');
  //     await expect(controller.findAll()).resolves.toEqual([
  //       {
  //         email: 'lygioian1@gmail.com',
  //         name: 'Ly Gioi An1',
  //       },
  //       {
  //         email: 'lygioian2@gmail.com',
  //         name: 'Ly Gioi An2',
  //       },
  //       {
  //         email: 'lygioian3@gmail.com',
  //         name: 'Ly Gioi An3',
  //       },
  //     ]);
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });
  // });
});
