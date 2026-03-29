import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";

@Injectable()
export class CardsService {

  constructor(
    @Inject('POINT_SERVICE') private readonly pointClient: ClientProxy
  ) {}


  findByClientId(clientId: number) {
    return this.pointClient.send('find_cards_by_client_id', { clientId }).pipe(
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
