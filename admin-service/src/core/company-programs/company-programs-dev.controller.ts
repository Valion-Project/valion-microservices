import {
  BadRequestException, Body,
  Controller,
  Get,
  Param,
  ParseIntPipe, Post, UsePipes, ValidationPipe
} from '@nestjs/common';
import {CompanyProgramsService} from "./company-programs.service";
import {CreateCompanyProgramDto} from "./dto/create-company-program.dto";

@Controller('company-programs-dev')
export class CompanyProgramsDevController {

  constructor(private companyProgramsService: CompanyProgramsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCompanyProgramDto: CreateCompanyProgramDto) {
    return this.companyProgramsService.create(createCompanyProgramDto);
  }

  @Get('company/:companyId')
  getByCompanyId(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.companyProgramsService.findByCompanyId(companyId);
  }

  @Get('availability/loyalty-programs/:companyId')
  getCompanyProgramAvailabilityInLoyaltyPrograms(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.companyProgramsService.findCompanyProgramAvailabilityInLoyaltyPrograms(companyId);
  }

  @Get('availability/companies/:loyaltyProgramId')
  getCompanyProgramAvailabilityInCompanies(@Param('loyaltyProgramId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) loyaltyProgramId: number) {
    return this.companyProgramsService.findCompanyProgramAvailabilityInCompanies(loyaltyProgramId);
  }
}
