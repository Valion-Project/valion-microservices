import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {SecurityEventsService} from "./security-events.service";
import {UpdateSecurityEventDto} from "./dto/update-security-event.dto";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";

@Controller('security-events')
export class SecurityEventsController {

  constructor(private securityEventsService: SecurityEventsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSecurityEventDto: CreateSecurityEventDto) {
    return this.securityEventsService.create(createSecurityEventDto);
  }

  @Get()
  getAll() {
    return this.securityEventsService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateSecurityEventDto: UpdateSecurityEventDto) {
    return this.securityEventsService.updateById(id, updateSecurityEventDto);
  }
}
