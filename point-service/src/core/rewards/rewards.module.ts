import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { RewardsDevController } from './rewards-dev.controller';

@Module({
  controllers: [RewardsController, RewardsDevController],
  providers: [RewardsService]
})
export class RewardsModule {}
