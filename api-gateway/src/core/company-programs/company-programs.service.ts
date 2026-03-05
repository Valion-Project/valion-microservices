import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateCompanyProgramDto} from "./dto/create-company-program.dto";

@Injectable()
export class CompanyProgramsService {

  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  create(createCompanyProgramDto: CreateCompanyProgramDto) {
    return this.adminClient.send('create_company_program', createCompanyProgramDto).pipe(
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

  findCompanyProgramAvailabilityInLoyaltyPrograms(companyId: number) {
    return this.adminClient.send('find_company_program_availability_in_loyalty_programs', { companyId }).pipe(
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

  findCompanyProgramAvailabilityInCompanies(loyaltyProgramId: number) {
    return this.adminClient.send('find_company_program_availability_in_companies', { loyaltyProgramId }).pipe(
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
