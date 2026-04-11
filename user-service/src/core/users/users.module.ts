import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {User} from "./entity/users.entity";
import {JwtStrategy} from "../../security/jwt.strategy";
import {UsersDevController} from "./users-dev.controller";
import {SecurityEvent} from "../security-events/entity/security-events.entity";
import {SecurityLog} from "../security-logs/entity/security-logs.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MailService} from "../../mail/mail.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, SecurityEvent, SecurityLog]),
    ClientsModule.register([
      {
        name: 'POINT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.POINT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Secret_Key_Valion_Back_022506',
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [UsersController, UsersDevController],
  providers: [UsersService, JwtStrategy, MailService]
})
export class UsersModule {}
