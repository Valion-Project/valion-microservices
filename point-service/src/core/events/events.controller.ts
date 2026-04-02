import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {EventsService} from "./events.service";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService) {}

  @MessagePattern('create_event_add')
  async createEventAdd(data: CreateEventAddDto) {
    try {
      return await this.eventsService.createEventAdd(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('create_event_redeem')
  async createEventRedeem(data: CreateEventRedeemDto) {
    try {
      return await this.eventsService.createEventRedeem(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
