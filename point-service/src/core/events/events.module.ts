import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsDevController } from './events-dev.controller';

@Module({
  controllers: [EventsController, EventsDevController],
  providers: [EventsService]
})
export class EventsModule {}
