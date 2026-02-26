import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SecurityLog} from "./entity/security-logs.entity";
import {Repository} from "typeorm";
import {MailService} from "../../mail/mail.service";
import {User} from "../users/entity/users.entity";
import {SecurityEvent} from "../security-events/entity/security-events.entity";
import {SendVerificationCodeDto} from "./dto/send-verification-code.dto";
import {FindVerificationCodeDto} from "./dto/find-verification-code.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityLogsService {

  constructor(
    @InjectRepository(SecurityLog) private securityLogRepository: Repository<SecurityLog>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SecurityEvent) private securityEventRepository: Repository<SecurityEvent>,
    private mailService: MailService
  ) {}

  async sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
    const user = await this.userRepository.findOneBy({
      email: sendVerificationCodeDto.email
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    const securityEvent = await this.securityEventRepository.findOneBy({
      name: "FORGOT_PASSWORD"
    });
    if (!securityEvent) {
      throw new NotFoundException({
        message: ['Evento de seguridad no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailService.sendVerificationCodeEmail(sendVerificationCodeDto.email, code);

    const newSecurityLog = this.securityLogRepository.create({
      data: code,
      used: false,
      user: user,
      securityEvent: securityEvent
    });
    await this.securityLogRepository.save(newSecurityLog);

    return { message: 'Correo enviado correctamente.' };
  }

  async findVerificationCode(findVerificationCodeDto: FindVerificationCodeDto) {
    const user = await this.userRepository.findOneBy({
      email: findVerificationCodeDto.email
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    const securityLog = await this.securityLogRepository.findOne({
      where: {
        user: { id: user.id },
        data: findVerificationCodeDto.code,
        used: false,
      },
      order: { createdAt: 'DESC' }
    });
    if (!securityLog) {
      throw new BadRequestException({
        message: ['Código ya usado o inválido.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    await this.securityLogRepository.update(securityLog.id, { used: true });

    return { message: 'Código validado correctamente.' };
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOneBy({
      email: resetPasswordDto.email
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    if (resetPasswordDto.invalidateTokens) {
      user.tokenVersion = user.tokenVersion + 1;
      await this.userRepository.update(user.id, { password: hashedPassword, tokenVersion: user.tokenVersion });
    } else {
      await this.userRepository.update(user.id, { password: hashedPassword });
    }

    return { message: 'Contraseña actualizada correctamente.' };
  }
}
