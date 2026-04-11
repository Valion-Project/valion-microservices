import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateOnboardingSessionDto} from "./dto/create-onboarding-session.dto";

@Injectable()
export class OnboardingSessionsService {

  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  create(createOnboardingSessionDto: CreateOnboardingSessionDto) {
    return this.adminClient.send('create_onboarding_session', createOnboardingSessionDto).pipe(
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

  findById(id: string) {
    return this.adminClient.send('find_onboarding_session_by_id', { id }).pipe(
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

  findByIdToValidate(id: string) {
    return this.adminClient.send('find_onboarding_session_by_id_to_validate', { id }).pipe(
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
