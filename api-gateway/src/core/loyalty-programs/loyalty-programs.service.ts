import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CreateLoyaltyProgramDto} from "./dto/create-loyalty-program.dto";
import {catchError} from "rxjs";
import {UpdateLoyaltyProgramDto} from "./dto/update-loyalty-program.dto";

@Injectable()
export class LoyaltyProgramsService {

  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  create(createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    return this.adminClient.send('create_loyalty_program', createLoyaltyProgramDto).pipe(
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
    return this.adminClient.send('find_all_loyalty_programs', {}).pipe(
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

  updateById(id: number, updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    return this.adminClient.send('update_loyalty_program_by_id', { id, updateLoyaltyProgramDto }).pipe(
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
