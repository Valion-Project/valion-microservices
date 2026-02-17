import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesDevController } from './companies-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./entity/companies.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company])
  ],
  controllers: [CompaniesController, CompaniesDevController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
