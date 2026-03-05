import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { LevelsDevController } from './levels-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Level} from "./entity/levels.entity";
import {Company} from "../companies/entity/companies.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Level, Company])
  ],
  controllers: [LevelsController, LevelsDevController],
  providers: [LevelsService]
})
export class LevelsModule {}
