import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {EventsService} from "./events.service";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Controller('events-dev')
export class EventsDevController {

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

  @Get('company/:id')
  getByCompanyId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.eventsService.findByCompanyId(id);
  }

  @Get('branch/:id')
  getByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.eventsService.findByBranchId(id);
  }

  @Get('operator-user/:id')
  getByOperatorUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.eventsService.findByOperatorUserId(id);
  }

  @Get('client/:id')
  getByClientId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.eventsService.findByClientId(id);
  }
}
