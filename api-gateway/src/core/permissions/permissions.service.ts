import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CreatePermissionDto} from "./dto/create-permission.dto";
import {catchError} from "rxjs";
import {UpdatePermissionDto} from "./dto/update-permission.dto";

@Injectable()
export class PermissionsService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.usersClient.send('create_permission', createPermissionDto).pipe(
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

  findAll() {
    return this.usersClient.send('find_all_permissions', {}).pipe(
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

  updateById(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.usersClient.send('update_permission_by_id', { id, updatePermissionDto }).pipe(
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
