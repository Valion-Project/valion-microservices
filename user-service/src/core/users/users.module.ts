import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {User} from "./entity/users.entity";
import {JwtStrategy} from "../../security/jwt.strategy";
import {UsersDevController} from "./users-dev.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Secret_Key_Valion_Back_022506',
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [UsersController, UsersDevController],
  providers: [UsersService, JwtStrategy]
})
export class UsersModule {}
