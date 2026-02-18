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
import {ClientsService} from "./clients.service";
import {CreateClientDto} from "./dto/create-client.dto";

@Controller('clients-dev')
export class ClientsDevController {

  constructor(private clientsService: ClientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('user/:id')
  getByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.clientsService.findByUserId(id);
  }
}
