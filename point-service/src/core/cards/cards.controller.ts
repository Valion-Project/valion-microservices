import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CardsService } from './cards.service';
import {CreateCardDto} from "./dto/create-card.dto";
import {CreateCardFromOnboardingDto} from "./dto/create-card-from-onboarding.dto";

@Controller('cards')
export class CardsController {
    
  constructor(private cardsService: CardsService) {}

  @MessagePattern('create_card')
  async createCard(data: CreateCardDto) {
    try {
      return await this.cardsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('create_card_from_onboarding')
  async createClientFromOnboarding(data: CreateCardFromOnboardingDto) {
    try {
      return await this.cardsService.createFromOnboarding(data);
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
