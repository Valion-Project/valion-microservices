import {BadRequestException, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Injectable()
export class EventsService {

  constructor(
    @Inject('POINT_SERVICE') private readonly pointClient: ClientProxy
  ) {}

  createEventAdd(createEventAddDto: CreateEventAddDto) {
    return this.pointClient.send('create_event_add', createEventAddDto).pipe(
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

  createEventRedeem(createEventRedeemDto: CreateEventRedeemDto) {
    return this.pointClient.send('create_event_redeem', createEventRedeemDto).pipe(
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
}
