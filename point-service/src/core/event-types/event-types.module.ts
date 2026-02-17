import { Module } from '@nestjs/common';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';
import { EventTypesDevController } from './event-types-dev.controller';

@Module({
  controllers: [EventTypesController, EventTypesDevController],
  providers: [EventTypesService]
})
export class EventTypesModule {}
