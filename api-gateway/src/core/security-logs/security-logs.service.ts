import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {SendVerificationCodeDto} from "./dto/send-verification-code.dto";
import {FindVerificationCodeDto} from "./dto/find-verification-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Injectable()
export class SecurityLogsService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
    return this.usersClient.send('send_verification_code', sendVerificationCodeDto).pipe(
      catchError(err => {
        if (err.statusCode === 400) {
          throw new BadRequestException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        } else if (err.statusCode === 404) {
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

  findVerificationCode(findVerificationCodeDto: FindVerificationCodeDto) {
    return this.usersClient.send('find_verification_code', findVerificationCodeDto).pipe(
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

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.usersClient.send('reset_password', resetPasswordDto).pipe(
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
