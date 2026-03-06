import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { CardsModule } from './core/cards/cards.module';
import { ClientsModule } from './core/clients/clients.module';
import { RewardsModule } from './core/rewards/rewards.module';
import { EventTypesModule } from './core/event-types/event-types.module';
import { EventsModule } from './core/events/events.module';
import { RewardBranchesModule } from './core/reward-branches/reward-branches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CardsModule,
    ClientsModule,
    RewardsModule,
    EventTypesModule,
    EventsModule,
    RewardBranchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
