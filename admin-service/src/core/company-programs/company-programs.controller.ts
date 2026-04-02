import { Controller } from '@nestjs/common';
import {CompanyProgramsService} from "./company-programs.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateCompanyProgramDto} from "./dto/create-company-program.dto";

@Controller('company-programs')
export class CompanyProgramsController {

  constructor(private companyProgramsService: CompanyProgramsService) {}

  @MessagePattern('create_company_program')
  async createCompanyProgram(data: CreateCompanyProgramDto) {
    try {
      return await this.companyProgramsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_company_program_by_id')
  async findById(data: { id: number }) {
    try {
      return await this.companyProgramsService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_company_program_availability_in_loyalty_programs')
  async findCompanyProgramAvailabilityInLoyaltyPrograms(data: { companyId: number }) {
    try {
      return await this.companyProgramsService.findCompanyProgramAvailabilityInLoyaltyPrograms(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_company_program_availability_in_companies')
  async findCompanyProgramAvailabilityInCompanies(data: { loyaltyProgramId: number }) {
    try {
      return await this.companyProgramsService.findCompanyProgramAvailabilityInCompanies(data.loyaltyProgramId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
