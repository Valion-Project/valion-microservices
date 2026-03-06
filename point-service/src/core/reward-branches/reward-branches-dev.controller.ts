import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {RewardBranchesService} from "./reward-branches.service";
import {CreateRewardBranchDto} from "./dto/create-reward-branch.dto";
import {UpdateRewardBranchDto} from "./dto/update-reward-branch.dto";

@Controller('reward-branches-dev')
export class RewardBranchesDevController {

  constructor(private rewardBranchesService: RewardBranchesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRewardBranchDto: CreateRewardBranchDto) {
    return this.rewardBranchesService.create(createRewardBranchDto);
  }

  @Get('availability/:companyId/rewards/:branchId')
  getRewardBranchAvailabilityInRewards(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number) {
    return this.rewardBranchesService.findRewardBranchAvailabilityInRewards(companyId, branchId);
  }

  @Get('availability/:companyId/branches/:rewardId')
  getRewardBranchAvailabilityInBranches(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number, @Param('rewardId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) rewardId: number) {
    return this.rewardBranchesService.findRewardBranchAvailabilityInBranches(companyId, rewardId);
  }

  @Get('branch/:branchId')
  getByBranchId(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number) {
    return this.rewardBranchesService.findByBranchId(branchId);
  }

  @Get('company/:companyId/not-branch/:branchId')
  getByNotBranchId(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number) {
    return this.rewardBranchesService.findByNotBranchId(companyId, branchId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateRewardBranchDto: UpdateRewardBranchDto) {
    return this.rewardBranchesService.updateById(id, updateRewardBranchDto);
  }
}
