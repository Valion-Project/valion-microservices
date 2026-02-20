import {Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";

@Injectable()
export class UserProfilesService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  findContextOptions(userId: number) {
    return this.usersClient.send('find_context_options', { userId }).pipe(
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

  validateProfileToken(type: string, userProfileId: number) {
    return this.usersClient.send('validate_profile_token', { type, userProfileId }).pipe(
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
}
