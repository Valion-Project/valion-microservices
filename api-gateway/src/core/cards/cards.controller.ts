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
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {

  constructor(private cardService: CardsService) {}

  @Get('client/:id')
  getByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.cardService.findByClientId(id);
  }

}
