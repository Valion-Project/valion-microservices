import { Controller } from '@nestjs/common';
import {SecurityEventsService} from "./security-events.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";
import {UpdateSecurityEventDto} from "./dto/update-security-event.dto";

@Controller('security-events')
export class SecurityEventsController {

  constructor(private securityEventsService: SecurityEventsService) {}

  @MessagePattern('create_security_event')
  async createSecurityEvent(data: CreateSecurityEventDto) {
    try {
      return await this.securityEventsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_all_security_events')
  async findAllSecurityEvents() {
    try {
      return await this.securityEventsService.findAll();
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_security_event_by_id')
  async updateSecurityEventById(data: { id: number, updateSecurityEventDto: UpdateSecurityEventDto }) {
    try {
      return await this.securityEventsService.updateById(data.id, data.updateSecurityEventDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
