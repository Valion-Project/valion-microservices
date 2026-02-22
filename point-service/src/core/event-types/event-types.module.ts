import { Module } from '@nestjs/common';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';
import { EventTypesDevController } from './event-types-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EventType} from "./entity/event-types.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EventType])
  ],
  controllers: [EventTypesController, EventTypesDevController],
  providers: [EventTypesService]
})
export class EventTypesModule {}
