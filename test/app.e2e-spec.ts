import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { createUserMock } from './../src/api/users/mock/create-user.mock';
import { AppModule } from './../src/app.module';

const userMock = new createUserMock();

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('UsersModule', () => {
    it('/ (GET USERS EMAIL) ', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/email')
        .query({ email: userMock.email });
      expect(response.body.status).toEqual(404);
      expect(response.body.message).toEqual(
        `User ${userMock.email} does not exists`,
      );
    });
    it('/ (POST USERS) ', async () => {
      return await request(app.getHttpServer())
        .post('/users')
        .send(userMock)
        .expect(201);
    });
    it('/ (PATCH USERS) ', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/email')
        .query({ email: userMock.email })
        .expect(200);
      expect(response.body.email).toEqual(userMock.email);
      await request(app.getHttpServer())
        .patch(`/users/${response.body.id}`)
        .send({
          email: response.body.email + '@',
          name: response.body.name,
          password: response.body.password,
        })
        .expect(200);
    });
    it('/ (DELETE USERS) ', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/email')
        .query({ email: userMock.email + '@' })
        .expect(200);
      expect(response.body.email).toEqual(userMock.email + '@');
      await request(app.getHttpServer())
        .delete(`/users/${response.body.id}`)
        .expect(200);
    });
  });
});
