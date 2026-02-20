import { Module } from '@nestjs/common';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesDevController } from './user-profiles-dev.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Profile} from "../profiles/entity/profiles.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UserProfile} from "./entity/user-profiles.entity";
import {User} from "../users/entity/users.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([UserProfile, User, Profile]),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
      {
        name: 'POINT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.POINT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Secret_Key_Valion_Back_022506',
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [UserProfilesController, UserProfilesDevController],
  providers: [UserProfilesService]
})
export class UserProfilesModule {}
