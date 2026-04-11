import { Module } from '@nestjs/common';
import { OnboardingSessionsController } from './onboarding-sessions.controller';
import { OnboardingSessionsService } from './onboarding-sessions.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
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
  controllers: [OnboardingSessionsController],
  providers: [OnboardingSessionsService]
})
export class OnboardingSessionsModule {}
