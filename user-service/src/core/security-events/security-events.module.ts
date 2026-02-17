import { Module } from '@nestjs/common';
import { SecurityEventsController } from './security-events.controller';
import { SecurityEventsService } from './security-events.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SecurityEvent} from "./entity/security-events.entity";
import { SecurityEventsDevController } from './security-events-dev.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityEvent])
  ],
  controllers: [SecurityEventsController, SecurityEventsDevController],
  providers: [SecurityEventsService]
})
export class SecurityEventsModule {}
