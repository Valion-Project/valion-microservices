import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {SecurityLogsService} from "./security-logs.service";
import {SendVerificationCodeDto} from "./dto/send-verification-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {FindVerificationCodeDto} from "./dto/find-verification-code.dto";

@Controller('security-logs')
export class SecurityLogsController {

  constructor(private securityLogsService: SecurityLogsService) {}

  @MessagePattern('send_verification_code')
  async sendVerificationCode(data: SendVerificationCodeDto) {
    try {
      return await this.securityLogsService.sendVerificationCode(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_verification_code')
  async findVerificationCode(data: FindVerificationCodeDto) {
    try {
      return await this.securityLogsService.findVerificationCode(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('reset_password')
  async resetPassword(data: ResetPasswordDto) {
    try {
      return await this.securityLogsService.resetPassword(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
