import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {JwtStrategy} from "../../security/jwt-strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USERS) ?? 3021,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy]
})
export class UsersModule {}
