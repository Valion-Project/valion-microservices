import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CardsService } from './cards.service';
import {CreateCardDto} from "./dto/create-card.dto";

@Controller('cards')
export class CardsController {
    
  constructor(private cardsService: CardsService) {}

  @MessagePattern('create_card')
  async createClient(data: CreateCardDto) {
    try {
      return await this.cardsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_cards_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.cardsService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_cards_by_client_id')
  async findByClientId(data: { clientId: number }) {
    try {
      return await this.cardsService.findByClientId(data.clientId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
