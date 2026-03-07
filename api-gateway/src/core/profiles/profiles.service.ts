import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { catchError } from 'rxjs/internal/operators/catchError';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class ProfilesService {

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  create(createProfileDto: CreateProfileDto) {
    return this.userClient.send('create_profile', createProfileDto).pipe(
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
    return this.userClient.send('find_profiles_by_company_id', { companyId }).pipe(
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

  updateById(id: number, updateProfileDto: UpdateProfileDto) {
    return this.userClient.send('update_profile_by_id', { id, updateProfileDto }).pipe(
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
