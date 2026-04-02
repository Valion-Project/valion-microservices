import {
  BadRequestException, Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {CardsService} from "./cards.service";
import {CreateCardDto} from "./dto/create-card.dto";

@Controller('cards-dev')
export class CardsDevController {

  constructor(private cardService: CardsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get('company/:id')
  getByCompanyId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.cardService.findByCompanyId(id);
  }

  @Get('client/:clientId')
  getByClientId(@Param('clientId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) clientId: number) {
    return this.cardService.findByClientId(clientId);
  }
}
