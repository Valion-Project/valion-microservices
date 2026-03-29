import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from './entity/cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card) private readonly cardsRepository: Repository<Card>
  ) {}

   async findByClientId(clientId: number) {
     const cards = await this.cardsRepository.find({
       where: {
        client:{
            id: clientId
        }
      }
     });
     if (!cards) {
       throw new NotFoundException({
         message: ['Tarjetas no encontradas.'],
         error: 'Not Found',
         statusCode: 404
       });
     }
 
     return { cards };
   }

}
