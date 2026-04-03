import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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

  findByCompanyId(companyId: number) {
    return this.pointClient.send('find_events_by_company_id', { companyId }).pipe(
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

  findByBranchId(branchId: number) {
    return this.pointClient.send('find_events_by_branch_id', { branchId }).pipe(
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

  findByOperatorUserId(operatorUserId: number) {
    return this.pointClient.send('find_events_by_operator_user_id', { operatorUserId }).pipe(
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

  findByClientId(clientId: number) {
    return this.pointClient.send('find_events_by_client_id', { clientId }).pipe(
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
