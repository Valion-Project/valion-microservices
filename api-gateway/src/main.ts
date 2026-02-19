import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const builder = new DocumentBuilder()
    .setTitle('Valion-Api-Gateway')
    .addBearerAuth(
      {
        type: 'http',
      },
      'jwt-auth'
    );

  if (process.env.NODE_ENV === 'production') {
    builder
      .addServer('api-gateway', 'Prod-dominio')
      .addServer('/', 'Prod-ip');
  } else {
    builder
      .addServer('/', 'Dev');
  }

  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3020);
}
bootstrap().then();
