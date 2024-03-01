import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const testIdx = Math.floor(Math.random() * 9999) + 10000;

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('schoolNewsFeed (Backend)');
  });

  describe('Schools', () => {
    it('/api/schools (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/schools')
        .send({
          testIdx,
          schoolRegion: 'Test',
          schoolName: 'Test' + testIdx,
        })
        .expect(201)
        .expect({ statusCode: 200, message: 'OK' });
    });
    it('/api/schools/:schoolId/news (POST)', () => {
      return request(app.getHttpServer())
        .post(`/api/schools/${testIdx}/news`)
        .send({
          testIdx,
          content: 'HI',
        })
        .expect(201)
        .expect({ statusCode: 200, message: 'OK' });
    });
    it('/api/schools/:schoolId/news/:newsId (PUT})', () => {
      return request(app.getHttpServer())
        .put(`/api/schools/${testIdx}/news/1`)
        .send({ content: 'Hello' })
        .expect(200)
        .expect({ statusCode: 200, message: 'OK' });
    });
    it('/api/schools/:schoolId/news/:newsId (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/api/schools/${testIdx}/news/1`)
        .expect(200)
        .expect({ statusCode: 200, message: 'OK' });
    });
  });

  describe('Students', () => {
    it('/api/students/:studentId/subscriptions/:schoolId (POST)', () => {
      return request(app.getHttpServer())
        .post(`/api/students/${testIdx}/subscriptions/${testIdx}`)
        .expect(201)
        .expect({ statusCode: 200, message: 'OK' });
    });
    it('/api/students/:studentId/subscriptions/:schoolId (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/api/students/${testIdx}/subscriptions/${testIdx}`)
        .expect(200)
        .expect({ statusCode: 200, message: 'OK' });
    });
  });
});
