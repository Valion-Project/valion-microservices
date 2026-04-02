import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {EventsService} from "./events.service";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService) {}

  @Post('add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createEventAdd(@Body() createEventAddDto: CreateEventAddDto) {
    return this.eventsService.createEventAdd(createEventAddDto);
  }

  @Post('redeem')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createEventRedeem(@Body() createEventRedeemDto: CreateEventRedeemDto) {
    return this.eventsService.createEventRedeem(createEventRedeemDto);
  }
}
