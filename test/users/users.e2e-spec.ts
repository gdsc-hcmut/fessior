import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import { UsersService } from '../../src/users/users.service';
import { CoreModule } from '../../src/core/core.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('Users', () => {
  const usersService = { findAll: () => ['test'] };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot(
          'mongodb+srv://GDSC:gdscurlshortener123@cluster0.4mncv.mongodb.net/new_fessior?authSource=admin&replicaSet=atlas-h2i7y8-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true',
        ),
        CoreModule,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: usersService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
