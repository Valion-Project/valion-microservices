import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule as ClientMicroserviceModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientMicroserviceModule.register([
      {
        name: 'POINT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
