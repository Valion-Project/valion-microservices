import { Module } from '@nestjs/common';
import { RewardBranchesController } from './reward-branches.controller';
import { RewardBranchesService } from './reward-branches.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {RewardBranch} from "./entity/reward-branch.entity";
import {Reward} from "../rewards/entity/rewards.entity";
import {RewardBranchesDevController} from "./reward-branches-dev.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([RewardBranch, Reward]),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
    ]),
  ],
  controllers: [RewardBranchesController, RewardBranchesDevController],
  providers: [RewardBranchesService]
})
export class RewardBranchesModule {}
