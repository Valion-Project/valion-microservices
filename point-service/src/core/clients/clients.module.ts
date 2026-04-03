import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsDevController } from './clients-dev.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Client} from "./entity/clients.entity";
import {ClientsModule as ClientMicroserviceModule, Transport} from "@nestjs/microservices";
import {JwtStrategy} from "../../security/jwt-strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Client]),
    ClientMicroserviceModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USER) ?? 3021,
        },
      },
    ]),
  ],
  controllers: [ClientsController, ClientsDevController],
  providers: [ClientsService, JwtStrategy]
})
export class ClientsModule {}
