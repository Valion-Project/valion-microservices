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
import {CompaniesService} from "./companies.service";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDto} from "./dto/update-company.dto";

@Controller('companies')
export class CompaniesController {

  constructor(private companiesService: CompaniesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  getAll() {
    return this.companiesService.findAll();
  }

  @Get('id/:id')
  getById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.companiesService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.updateById(id, updateCompanyDto);
  }
}
