import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import {CreateUserProfileAndUserDto} from "./dto/create-user-profile-and-user.dto";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";

@Injectable()
export class UserProfilesService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  create(createUserProfileDto: CreateUserProfileDto) {
    return this.usersClient.send('create_user_profile', createUserProfileDto).pipe(
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

  createUserProfileAndUser(createUserProfileAndUserDto: CreateUserProfileAndUserDto) {
    return this.usersClient.send('create_user_profile_and_user', createUserProfileAndUserDto).pipe(
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

  findContextOptions(userId: number) {
    return this.usersClient.send('find_context_options', { userId }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        } else if (err.statusCode === 500) {
          throw new InternalServerErrorException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  generateProfileToken(userId: number, type: string, userProfileId: number) {
    return this.usersClient.send('generate_profile_token', { userId, type, userProfileId }).pipe(
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

  validateProfileToken(userId: number, type: string, userProfileId: number) {
    return this.usersClient.send('validate_profile_token', { userId, type, userProfileId }).pipe(
      catchError(err => {
        if (err.statusCode === 401) {
          throw new UnauthorizedException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  findUserProfileAvailabilityInProfiles(companyId: number, userId: number) {
    return this.usersClient.send('find_user_profile_availability_in_profiles', { companyId, userId }).pipe(
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

  updateById(id: number, updateUserProfileDto: UpdateUserProfileDto) {
    return this.usersClient.send('update_user_profile_by_id', { id, updateUserProfileDto }).pipe(
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
    )
  }
}
