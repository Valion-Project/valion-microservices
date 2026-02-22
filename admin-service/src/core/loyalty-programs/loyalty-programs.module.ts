import { Module } from '@nestjs/common';
import { LoyaltyProgramsController } from './loyalty-programs.controller';
import { LoyaltyProgramsService } from './loyalty-programs.service';
import { LoyaltyProgramsDevController } from './loyalty-programs-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoyaltyProgram} from "./entity/loyalty-programs.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LoyaltyProgram])
  ],
  controllers: [LoyaltyProgramsController, LoyaltyProgramsDevController],
  providers: [LoyaltyProgramsService]
})
export class LoyaltyProgramsModule {}
