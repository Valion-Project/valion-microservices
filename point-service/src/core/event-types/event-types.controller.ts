import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {EventTypesService} from "./event-types.service";
import {CreateEventTypeDto} from "./dto/create-event-type.dto";
import {UpdateEventTypeDto} from "./dto/update-event-type.dto";

@Controller('event-types')
export class EventTypesController {

  constructor(private eventTypesService: EventTypesService) {}

  @MessagePattern('create_event_type')
  async createEventType(data: CreateEventTypeDto) {
    try {
      return await this.eventTypesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_all_event_types')
  async findAllEventTypes() {
    try {
      return await this.eventTypesService.findAll();
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_event_type_by_id')
  async updateEventTypeById(data: { id: number, updateEventTypeDto: UpdateEventTypeDto }) {
    try {
      return await this.eventTypesService.updateById(data.id, data.updateEventTypeDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
