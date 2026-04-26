import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateRewardDto} from "./dto/create-reward.dto";
import {UpdateRewardDto} from "./dto/update-reward.dto";

@Injectable()
export class RewardsService {

  constructor(
    @Inject('POINT_SERVICE') private readonly pointClient: ClientProxy
  ) {}

  create(createRewardDto: CreateRewardDto) {
    return this.pointClient.send('create_reward', createRewardDto).pipe(
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

  findByCompanyId(companyId: number) {
    return this.pointClient.send('find_rewards_by_company_id', { companyId }).pipe(
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
    );
  }

  findByCompanyProgramId(companyProgramId: number) {
    return this.pointClient.send('find_rewards_by_company_program_id', { companyProgramId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        } else if (err.statusCode === 400) {
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

  updateById(id: number, updateRewardDto: UpdateRewardDto) {
    return this.pointClient.send('update_reward_by_id', { id, updateRewardDto }).pipe(
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
    );
  }
}
