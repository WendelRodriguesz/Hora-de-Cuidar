import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReferenciasModule } from '../referencias.module';

describe('ReferenciasController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ReferenciasModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/referencias/estados (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/referencias/estados').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/referencias/estados/CE/municipios (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/referencias/estados/CE/municipios').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/referencias/cep/:cep (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/referencias/cep/62140000').expect(200);
    expect(res.body.estado).toBe('CE');
  });

  afterAll(async () => {
    await app.close();
  });
});
