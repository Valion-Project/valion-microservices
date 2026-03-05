import { Module } from '@nestjs/common';
import { CompanyProgramsController } from './company-programs.controller';
import { CompanyProgramsService } from './company-programs.service';
import { CompanyProgramsDevController } from './company-programs-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CompanyProgram} from "./entity/company-programs.entity";
import {LoyaltyProgram} from "../loyalty-programs/entity/loyalty-programs.entity";
import {Company} from "../companies/entity/companies.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyProgram, LoyaltyProgram, Company])
  ],
  controllers: [CompanyProgramsController, CompanyProgramsDevController],
  providers: [CompanyProgramsService]
})
export class CompanyProgramsModule {}
