import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { CoreModule } from '../../src/core/core.module';
import { UsersModule } from '../../src/users/users.module';
import { UsersService } from '../../src/users/users.service';

describe('Users', () => {
  const usersService = { findAll: (): Array<string> => ['test'] };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule, MongooseModule.forRoot(process.env.DB_HOST), CoreModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, async () => {
    expect(true).toBeDefined();
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: usersService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
