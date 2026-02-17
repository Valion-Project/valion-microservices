import { Module } from '@nestjs/common';
import { CompanyProgramsController } from './company-programs.controller';
import { CompanyProgramsService } from './company-programs.service';
import { CompanyProgramsDevController } from './company-programs-dev.controller';

@Module({
  controllers: [CompanyProgramsController, CompanyProgramsDevController],
  providers: [CompanyProgramsService]
})
export class CompanyProgramsModule {}
