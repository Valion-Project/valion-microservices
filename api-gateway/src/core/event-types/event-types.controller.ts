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
import {EventTypesService} from "./event-types.service";
import {CreateEventTypeDto} from "./dto/create-event-type.dto";
import {UpdateEventTypeDto} from "./dto/update-event-type.dto";

@Controller('event-types')
export class EventTypesController {

  constructor(private eventTypesService: EventTypesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createEventTypeDto: CreateEventTypeDto) {
    return this.eventTypesService.create(createEventTypeDto);
  }

  @Get()
  getAll() {
    return this.eventTypesService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateEventTypeDto: UpdateEventTypeDto) {
    return this.eventTypesService.updateById(id, updateEventTypeDto);
  }
}
