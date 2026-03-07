import { Module } from '@nestjs/common';
import { ProfilePermissionsController } from './profile-permissions.controller';
import { ProfilePermissionsService } from './profile-permissions.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USERS) ?? 3021,
        },
      },
    ]),
  ],
  controllers: [ProfilePermissionsController],
  providers: [ProfilePermissionsService]
})
export class ProfilePermissionsModule {}
