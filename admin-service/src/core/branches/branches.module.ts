import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchesDevController } from './branches-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Branch} from "./entity/branches.entity";
import {Company} from "../companies/entity/companies.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Company])
  ],
  controllers: [BranchesController, BranchesDevController],
  providers: [BranchesService]
})
export class BranchesModule {}
