import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from './entity/cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>
  ) {}

   async findByClientId(clientId: number) {
     const cards = await this.cardRepository.findBy({
       client: { id: clientId }
     });
     if (cards.length === 0) {
       throw new NotFoundException({
         message: ['Tarjetas no encontradas.'],
         error: 'Not Found',
         statusCode: 404
       });
     }
 
     return { cards };
   }
}
