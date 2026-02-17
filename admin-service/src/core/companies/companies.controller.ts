import {Controller} from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {CompaniesService} from "./companies.service";

@Controller('companies')
export class CompaniesController {

  constructor(private companiesService: CompaniesService) {}

  @MessagePattern('create_permission')
  async createPermission(data: CreateCompanyDto) {
    try {
      return await this.companiesService.create(data);
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
}
