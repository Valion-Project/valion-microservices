import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {SecurityEventsService} from "./security-events.service";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";

@Controller('security-event-dev')
export class SecurityEventsDevController {

  constructor(private securityEventsService: SecurityEventsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSecurityEventDto: CreateSecurityEventDto) {
    return this.securityEventsService.create(createSecurityEventDto);
  }
}
