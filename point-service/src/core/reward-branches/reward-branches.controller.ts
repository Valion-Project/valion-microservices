import { Controller } from '@nestjs/common';
import {RewardBranchesService} from "./reward-branches.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateRewardBranchDto} from "./dto/create-reward-branch.dto";
import {UpdateRewardBranchDto} from "./dto/update-reward-branch.dto";

@Controller('reward-branches')
export class RewardBranchesController {

  constructor(private rewardBranchesService: RewardBranchesService) {}

  @MessagePattern('create_company_program')
  async createCompanyProgram(data: CreateRewardBranchDto) {
    try {
      return await this.rewardBranchesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_reward_branch_availability_in_rewards')
  async findRewardBranchAvailabilityInRewards(data: { companyId: number, branchId: number }) {
    try {
      return await this.rewardBranchesService.findRewardBranchAvailabilityInRewards(data.companyId, data.branchId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_reward_branch_availability_in_branches')
  async findRewardBranchAvailabilityInBranches(data: { companyId: number, rewardId: number }) {
    try {
      return await this.rewardBranchesService.findRewardBranchAvailabilityInBranches(data.companyId, data.rewardId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_reward_branches_by_branch_id')
  async findByBranchId(data: { branchId: number }) {
    try {
      return await this.rewardBranchesService.findByBranchId(data.branchId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_reward_branches_by_not_branch_id')
  async findRewardBranchByNotBranchId(data: { companyId: number, branchId: number }) {
    try {
      return await this.rewardBranchesService.findByNotBranchId(data.companyId, data.branchId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_reward_branch_by_id')
  async updateRewardBranchById(data: { id: number, updateRewardBranchDto: UpdateRewardBranchDto }) {
    try {
      return await this.rewardBranchesService.updateById(data.id, data.updateRewardBranchDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
