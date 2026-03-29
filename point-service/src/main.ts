import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
  console.log('USER:', process.env.DATABASE_USER);
  const app = await NestFactory.create(AppModule);

  const builder = new DocumentBuilder()
    .setTitle('Valion-Point-Microservice')
    .addBearerAuth(
      {
        type: 'http',
      },
      'jwt-auth'
    );

  builder
    .addServer('/', 'Dev');

  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) ?? 3023,
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(process.env.PORT_DEV) ?? 3026);
}
bootstrap().then();
