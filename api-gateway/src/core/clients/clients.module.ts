import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
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
          host: process.env.POINT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
