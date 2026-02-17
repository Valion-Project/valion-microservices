import { Controller } from '@nestjs/common';
import {SecurityEventsService} from "./security-events.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";

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
}
