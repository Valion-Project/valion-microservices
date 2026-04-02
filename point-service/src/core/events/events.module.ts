import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsDevController } from './events-dev.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Event} from "./entity/events.entity";
import {EventType} from "../event-types/entity/event-types.entity";
import {Card} from "../cards/entity/cards.entity";
import {Reward} from "../rewards/entity/rewards.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Event, EventType, Card, Reward]),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USER) ?? 3021,
        },
      }
    ])
  ],
  controllers: [EventsController, EventsDevController],
  providers: [EventsService]
})
export class EventsModule {}
