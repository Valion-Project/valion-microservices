import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateRewardBranchDto} from "./dto/create-reward-branch.dto";
import {UpdateRewardBranchDto} from "./dto/update-reward-branch.dto";

@Injectable()
export class RewardBranchesService {

  constructor(
    @Inject('POINT_SERVICE') private readonly pointClient: ClientProxy
  ) {}

  create(createRewardBranchDto: CreateRewardBranchDto) {
    return this.pointClient.send('create_company_program', createRewardBranchDto).pipe(
      catchError(err => {
        if (err.statusCode === 400) {
          throw new BadRequestException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  findRewardBranchAvailabilityInRewards(companyId: number, branchId: number) {
    return this.pointClient.send('find_reward_branch_availability_in_rewards', { companyId, branchId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    )
  }

  findRewardBranchAvailabilityInBranches(companyId: number, rewardId: number) {
    return this.pointClient.send('find_reward_branch_availability_in_branches', { companyId, rewardId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    )
  }

  findByBranchId(branchId: number) {
    return this.pointClient.send('find_reward_branches_by_branch_id', { branchId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    )
  }

  findByNotBranchId(companyId: number, branchId: number) {
    return this.pointClient.send('find_reward_branches_by_not_branch_id', { companyId, branchId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    )
  }

  updateById(id: number, updateRewardBranchDto: UpdateRewardBranchDto) {
    return this.pointClient.send('update_reward_branch_by_id', { id, updateRewardBranchDto }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    )
  }
}
