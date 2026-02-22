import {Controller} from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {CompaniesService} from "./companies.service";
import {UpdateCompanyDto} from "./dto/update-company.dto";

@Controller('companies')
export class CompaniesController {

  constructor(private companiesService: CompaniesService) {}

  @MessagePattern('create_company')
  async createCompany(data: CreateCompanyDto) {
    try {
      return await this.companiesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_all_companies')
  async findAllCompanies() {
    try {
      return await this.companiesService.findAll();
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_company_by_id')
  async findById(data: { id: number }) {
    try {
      return await this.companiesService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_company_by_id')
  async updateCompanyById(data: { id: number, updateCompanyDto: UpdateCompanyDto }) {
    try {
      return await this.companiesService.updateById(data.id, data.updateCompanyDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
