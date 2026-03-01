import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Profile} from "./entity/profiles.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ProfilesDevController} from "./profiles-dev.controller";
import {User} from "../users/entity/users.entity";
import {Permission} from "../permissions/entity/permissions.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Profile, Permission, User]),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
    ]),
  ],
  controllers: [ProfilesController, ProfilesDevController],
  providers: [ProfilesService]
})
export class ProfilesModule {}
