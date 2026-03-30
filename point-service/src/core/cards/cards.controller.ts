import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    
  constructor(private cardsService: CardsService) {}

  @MessagePattern('find_cards_by_client_id')
  async findByClientId(data: { clientId: number }) {
    try {
      return await this.cardsService.findByClientId(data.clientId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
