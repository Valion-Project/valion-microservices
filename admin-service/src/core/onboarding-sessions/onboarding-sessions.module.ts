import { Module } from '@nestjs/common';
import { OnboardingSessionsController } from './onboarding-sessions.controller';
import { OnboardingSessionsService } from './onboarding-sessions.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OnboardingSession} from "./entity/onboarding-session.entity";
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {CompanyProgram} from "../company-programs/entity/company-programs.entity";
import {Branch} from "../branches/entity/branches.entity";
import {OnboardingSessionsDevController} from "./onboarding-sessions-dev.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([OnboardingSession, CompanyProgram, Branch]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USER) ?? 3021,
        },
      }
    ])
  ],
  controllers: [OnboardingSessionsController, OnboardingSessionsDevController],
  providers: [OnboardingSessionsService]
})
export class OnboardingSessionsModule {}
