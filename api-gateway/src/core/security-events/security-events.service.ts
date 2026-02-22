import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";
import {UpdateSecurityEventDto} from "./dto/update-security-event.dto";

@Injectable()
export class SecurityEventsService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  create(createSecurityEventDto: CreateSecurityEventDto) {
    return this.usersClient.send('create_security_event', createSecurityEventDto).pipe(
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
    return this.usersClient.send('find_all_security_events', {}).pipe(
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

  updateById(id: number, updateSecurityEventDto: UpdateSecurityEventDto) {
    return this.usersClient.send('update_security_event_by_id', { id, updateSecurityEventDto }).pipe(
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
