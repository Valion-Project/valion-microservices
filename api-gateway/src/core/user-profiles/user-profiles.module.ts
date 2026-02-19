import { Module } from '@nestjs/common';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
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
  controllers: [UserProfilesController],
  providers: [UserProfilesService]
})
export class UserProfilesModule {}
