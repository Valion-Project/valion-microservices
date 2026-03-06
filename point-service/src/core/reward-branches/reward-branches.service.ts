import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RewardBranch} from "./entity/reward-branch.entity";
import {In, Not, Repository} from "typeorm";
import {Reward} from "../rewards/entity/rewards.entity";
import {ClientProxy} from "@nestjs/microservices";
import {CreateRewardBranchDto} from "./dto/create-reward-branch.dto";
import {catchError, firstValueFrom} from "rxjs";
import {RewardBranchDto} from "./dto/reward-branch.dto";
import {UpdateRewardBranchDto} from "./dto/update-reward-branch.dto";

@Injectable()
export class RewardBranchesService {

  constructor(
    @InjectRepository(RewardBranch) private readonly rewardBranchRepository: Repository<RewardBranch>,
    @InjectRepository(Reward) private readonly rewardRepository: Repository<Reward>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
  ) {}

  async create(createRewardBranchDto: CreateRewardBranchDto) {
    const rewardBranchExisting = await this.rewardBranchRepository.findOneBy({
      reward: { id: createRewardBranchDto.rewardId },
      branchId: createRewardBranchDto.branchId
    });
    if (rewardBranchExisting) {
      throw new BadRequestException({
        message: ['Recompensa en sucursal ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const reward = await this.rewardRepository.findOneBy({
      id: createRewardBranchDto.rewardId
    });
    if (!reward) {
      throw new BadRequestException({
        message: ['Recompensa no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const branchResponse = await firstValueFrom(
      this.adminClient.send('find_branch_by_id', { id: createRewardBranchDto.branchId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Usuario no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const newRewardBranch = this.rewardBranchRepository.create({
      isAvailable: createRewardBranchDto.isAvailable,
      branchId: createRewardBranchDto.branchId,
      reward: reward,
    });
    const savedRewardBranch = await this.rewardBranchRepository.save(newRewardBranch);

    return {
      rewardBranch: {
        ...savedRewardBranch,
        branch: branchResponse.branch,
      }
    }
  }

  async findRewardBranchAvailabilityInRewards(companyId: number, branchId: number) {
    const rewards = await this.rewardRepository.findBy({
      companyId
    });
    const branchResponse = await firstValueFrom(
      this.adminClient.send('find_branch_by_id', { id: branchId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new NotFoundException({
              message: ['Sucursal no encontrada.'],
              error: 'Not Found',
              statusCode: 404
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const rewardBranches: RewardBranchDto[] = [];

    for (const reward of rewards) {
      const rewardBranch = await this.rewardBranchRepository.findOne({
        where: { reward: { id: reward.id }, branchId: branchId },
        relations: ['reward']
      });
      if (rewardBranch) {
        const rewardBranchDto = {
          ...rewardBranch,
          branch: branchResponse.branch,
        } as RewardBranchDto;
        rewardBranches.push(rewardBranchDto);
      } else {
        const rewardBranchDto = {
          reward: reward,
          branch: branchResponse.branch,
        } as RewardBranchDto;
        rewardBranches.push(rewardBranchDto);
      }
    }

    return { rewardBranches };
  }

  async findRewardBranchAvailabilityInBranches(companyId: number, rewardId: number) {
    const branchResponse = await firstValueFrom(
      this.adminClient.send('find_branches_by_company_id', { companyId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new NotFoundException({
              message: ['Sucursales no encontradas.'],
              error: 'Not Found',
              statusCode: 404
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );
    const reward = await this.rewardRepository.findOneBy({
      id: rewardId
    });

    const rewardBranches: RewardBranchDto[] = [];

    for (const branch of branchResponse.branches) {
      const rewardBranch = await this.rewardBranchRepository.findOne({
        where: { reward: { id: rewardId }, branchId: branch.id },
        relations: ['reward']
      });
      if (rewardBranch) {
        const rewardBranchDto = {
          ...rewardBranch,
          branch: branch,
        } as RewardBranchDto;
        rewardBranches.push(rewardBranchDto);
      } else {
        const rewardBranchDto = {
          reward: reward,
          branch: branch,
        } as RewardBranchDto;
        rewardBranches.push(rewardBranchDto);
      }
    }

    return { rewardBranches };
  }

  async findByNotBranchId(companyId: number, branchId: number) {
    const rewardBranches = await this.rewardBranchRepository.find({
      where: { branchId },
      relations: ['reward'],
    });

    const rewardsIds = rewardBranches.map(rewardBranch => rewardBranch.reward.id);

    const rewardsNotInBranch = await this.rewardRepository.findBy({
      id: Not(In(rewardsIds)), companyId
    });

    const rewardBranchesNotInBranch: RewardBranch[] = [];

    for (const reward of rewardsNotInBranch) {
      const rewardBranch = {
        reward: reward,
      } as RewardBranch;
      rewardBranchesNotInBranch.push(rewardBranch);
    }

    return { rewardBranches: rewardBranchesNotInBranch };
  }

  async findByBranchId(branchId: number) {
    const rewardBranches = await this.rewardBranchRepository.find({
      where: { branchId },
      relations: ['reward'],
    });
    if (rewardBranches.length === 0) {
      throw new NotFoundException({
        message: ['Recompensas en sucursales no encontradas.'],
        error: "Not Found",
        statusCode: 404
      })
    }

    return { rewardBranches };
  }

  async findById(id: number) {
    const rewardBranch = await this.rewardBranchRepository.findOne({
      where: { id },
      relations: ['reward'],
    });
    if (!rewardBranch) {
      throw new NotFoundException({
        message: ['Recompensa en sucursal no encontrada.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    const branchResponse = await firstValueFrom(
      this.adminClient.send('find_branch_by_id', { id: rewardBranch.branchId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Usuario no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    return {
      rewardBranch: {
        ...rewardBranch,
        branch: branchResponse.branch,
      }
    }
  }

  async updateById(id: number, updateRewardBranchDto: UpdateRewardBranchDto) {
    const rewardBranch = await this.rewardBranchRepository.findOneBy({
      id
    });
    if (!rewardBranch) {
      throw new NotFoundException({
        message: ['Recompensa en sucursal no encontrada.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.rewardBranchRepository.update(id, updateRewardBranchDto);

    return this.findById(id);
  }
}
