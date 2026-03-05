import { Controller } from '@nestjs/common';
import {RewardsService} from "./rewards.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateRewardDto} from "./dto/create-reward.dto";
import {UpdateRewardDto} from "./dto/update-reward.dto";

@Controller('rewards')
export class RewardsController {

  constructor(private rewardsService: RewardsService) {}

  @MessagePattern('create_reward')
  async createReward(data: CreateRewardDto) {
    try {
      return await this.rewardsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_rewards_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.rewardsService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_reward_by_id')
  async updateRewardById(data: { id: number, updateRewardDto: UpdateRewardDto }) {
    try {
      return await this.rewardsService.updateById(data.id, data.updateRewardDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}