import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {SecurityLogsService} from "./security-logs.service";
import {SendVerificationCodeDto} from "./dto/send-verification-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {FindVerificationCodeDto} from "./dto/find-verification-code.dto";

@Controller('security-logs-dev')
export class SecurityLogsDevController {

  constructor(private securityLogsService: SecurityLogsService) {}

  @Get()
  getAll() {
    return this.securityLogsService.findAll();
  }

  @Post('verification/send-verification-code')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
    return this.securityLogsService.sendVerificationCode(sendVerificationCodeDto);
  }

  @Post('verification/find-verification-code')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  findVerificationCode(@Body() findVerificationCodeDto: FindVerificationCodeDto) {
    return this.securityLogsService.findVerificationCode(findVerificationCodeDto);
  }

  @Post('verification/reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.securityLogsService.resetPassword(resetPasswordDto);
  }
}
