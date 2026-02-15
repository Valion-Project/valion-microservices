import {Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";

@Injectable()
export class UsersService {

  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  findById(id: number) {
    return this.usersClient.send('find_by_id', { id }).pipe(
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

  findByIdToValidateToken(id: number) {
    return this.usersClient.send('find_by_id_to_validate_token', { id }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException(err.message);
        }
        throw new InternalServerErrorException();
      })
    );
  }
}
