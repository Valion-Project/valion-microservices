import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {ClientsService} from "./clients.service";
import {CreateClientDto} from "./dto/create-client.dto";
import {ApiBearerAuth} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";

@Controller('clients')
export class ClientsController {

  constructor(private clientsService: ClientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyClient(@Request() req: any) {
    return this.clientsService.findByUserId(req.user.id);
  }

  @Get('user/:id')
  getByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.clientsService.findByUserId(id);
  }

  @Get('identificationNumber/:identificationNumber')
  getByIdentificationNumber(@Param('identificationNumber') identificationNumber: string) {
    return this.clientsService.findByIdentificationNumber(identificationNumber);
  }

  @Get('identificationNumber/:identificationNumber/company/:companyId')
  getByIdentificationNumberAndCompanyId(@Param('identificationNumber') identificationNumber: string, @Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.clientsService.findByIdentificationNumberAndCompanyId(identificationNumber, companyId);
  }
}
