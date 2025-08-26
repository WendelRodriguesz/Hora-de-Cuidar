import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export function configurarSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('HDC - Hora de Cuidar (API)')
    .setDescription("API do HDC para acompanhamento de pacientes por múltiplos profissionais. " +
      "Rotas protegidas exigem Bearer JWT (obtenha via /auth/login).")
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const tornarPublica = (path: string, method: keyof typeof document.paths[string]) => {
    const op = document.paths?.[path]?.[method];
    if (op && typeof op === 'object' && 'security' in op) {
      (op as { security?: any }).security = [];
    }
  };
  tornarPublica('/auth/login', 'post');

  SwaggerModule.setup('api-docs', app, document, { jsonDocumentUrl: 'docs-json' });
}
