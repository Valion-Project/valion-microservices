import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsDevController } from './cards-dev.controller';

@Module({
  controllers: [CardsController, CardsDevController],
  providers: [CardsService]
})
export class CardsModule {}
