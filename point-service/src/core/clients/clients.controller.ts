import { Controller } from '@nestjs/common';
import {ClientsService} from "./clients.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateClientDto} from "./dto/create-client.dto";

@Controller('clients')
export class ClientsController {

  constructor(private clientsService: ClientsService) {}

  @MessagePattern('create_client')
  async createClient(data: CreateClientDto) {
    try {
      return await this.clientsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_client_by_user_id')
  async findByUserId(data: { userId: number }) {
    try {
      return await this.clientsService.findByUserId(data.userId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_client_by_identification_number')
  async findByIdentificationNumber(data: { identificationNumber: string }) {
    try {
      return await this.clientsService.findByIdentificationNumber(data.identificationNumber);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_client_by_identification_number_and_company_id')
  async findByIdentificationNumberAndCompanyId(data: { identificationNumber: string, companyId: number }) {
    try {
      return await this.clientsService.findByIdentificationNumberAndCompanyId(data.identificationNumber, data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
