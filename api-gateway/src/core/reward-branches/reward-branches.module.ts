import { Module } from '@nestjs/common';
import { RewardBranchesController } from './reward-branches.controller';
import { RewardBranchesService } from './reward-branches.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'POINT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.POINT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
    ]),
  ],
  controllers: [RewardBranchesController],
  providers: [RewardBranchesService]
})
export class RewardBranchesModule {}
