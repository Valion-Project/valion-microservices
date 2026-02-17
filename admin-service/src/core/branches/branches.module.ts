import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchesDevController } from './branches-dev.controller';

@Module({
  controllers: [BranchesController, BranchesDevController],
  providers: [BranchesService]
})
export class BranchesModule {}
