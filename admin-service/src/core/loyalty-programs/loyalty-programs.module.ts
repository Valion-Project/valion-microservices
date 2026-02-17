import { Module } from '@nestjs/common';
import { LoyaltyProgramsController } from './loyalty-programs.controller';
import { LoyaltyProgramsService } from './loyalty-programs.service';
import { LoyaltyProgramsDevController } from './loyalty-programs-dev.controller';

@Module({
  controllers: [LoyaltyProgramsController, LoyaltyProgramsDevController],
  providers: [LoyaltyProgramsService]
})
export class LoyaltyProgramsModule {}
