import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reward} from "./entity/rewards.entity";
import {Repository} from "typeorm";
import {ClientProxy} from "@nestjs/microservices";
import {CreateRewardDto} from "./dto/create-reward.dto";
import {catchError, firstValueFrom} from "rxjs";
import {UpdateRewardDto} from "./dto/update-reward.dto";

@Injectable()
export class RewardsService {

  constructor(
    @InjectRepository(Reward) private readonly rewardRepository: Repository<Reward>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
  ) {}

  async create(createRewardDto: CreateRewardDto) {
    const rewardExisting = await this.rewardRepository.findOneBy({
      name: createRewardDto.name,
      companyId: createRewardDto.companyId,
    });
    if (rewardExisting) {
      throw new BadRequestException({
        message: ['Recompensa ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const adminResponse = await firstValueFrom(
      this.adminClient.send('find_company_by_id', { id: createRewardDto.companyId }).pipe(
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

    const newReward = this.rewardRepository.create({
      name: createRewardDto.name,
      description: createRewardDto.description,
      pointCost: createRewardDto.pointCost,
      visitCost: createRewardDto.visitCost,
      companyId: createRewardDto.companyId,
    });
    const savedReward = await this.rewardRepository.save(newReward);

    return {
      reward: {
        ...savedReward,
        company: adminResponse.company,
      }
    };
  }

  async findByCompanyId(companyId: number) {
    const rewards = await this.rewardRepository.findBy({
      companyId
    });
    if (rewards.length === 0) {
      throw new NotFoundException({
        message: ['Recompensas no encontradas.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { rewards };
  }

  async findById(id: number) {
    const reward = await this.rewardRepository.findOneBy({
      id
    });
    if (!reward) {
      throw new NotFoundException({
        message: ['Recompensa no encontrada.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { reward };
  }

  async updateById(id: number, updateRewardDto: UpdateRewardDto) {
    const reward = await this.rewardRepository.findOneBy({
      id
    });
    if (!reward) {
      throw new NotFoundException({
        message: ['Recompensa no encontrada.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.rewardRepository.update(id, updateRewardDto);

    return this.findById(id);
  }
}