import {BadRequestException, Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {CardsService} from "./cards.service";

@Controller('cards-dev')
export class CardsDevController {

  constructor(private cardService: CardsService) {}

  @Get('client/:clientId')
  getByUserId(@Param('clientId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) clientId: number) {
    return this.cardService.findByClientId(clientId);
  }
}
