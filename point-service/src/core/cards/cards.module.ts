import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsDevController } from './cards-dev.controller';
import { Card } from './entity/cards.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
  ],
  controllers: [CardsController, CardsDevController],
  providers: [CardsService]
})

export class CardsModule {}
