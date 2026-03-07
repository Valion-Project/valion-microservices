import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";
import {UpdateProfilePermissionDto} from "./dto/update-profile-permission.dto";

@Injectable()
export class ProfilePermissionsService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  create(createProfilePermissionDto: CreateProfilePermissionDto) {
    return this.usersClient.send('create_profile_permission', createProfilePermissionDto).pipe(
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

  findProfilePermissionAvailabilityInPermissions(profileId: number) {
    return this.usersClient.send('find_profile_permission_availability_in_permissions', { profileId }).pipe(
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

  updateById(id: number, updateProfilePermissionDto: UpdateProfilePermissionDto) {
    return this.usersClient.send('update_profile_permission_by_id', { id, updateProfilePermissionDto }).pipe(
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
