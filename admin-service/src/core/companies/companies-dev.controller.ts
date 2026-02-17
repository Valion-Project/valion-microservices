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
import {CompaniesService} from "./companies.service";
import {CreateCompanyDto} from "./dto/create-company.dto";

@Controller('companies-dev')
export class CompaniesDevController {

  constructor(private companiesService: CompaniesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }


  @Get('id/:id')
  getById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.companiesService.findById(id);
  }
}