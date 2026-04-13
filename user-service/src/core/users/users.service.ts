import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/users.entity";
import {DataSource, Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {SecurityLog} from "../security-logs/entity/security-logs.entity";
import {SecurityEvent} from "../security-events/entity/security-events.entity";
import {MailService} from "../../mail/mail.service";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom, of} from "rxjs";
import { UpdateUserDto } from './dto/update-user.dto';
import {UserQuickStartDto} from "./dto/user-quick-start.dto";
import {CompleteOnboardingDto} from "./dto/complete-onboarding.dto";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SecurityEvent) private securityEventRepository: Repository<SecurityEvent>,
    @InjectRepository(SecurityLog) private securityLogRepository: Repository<SecurityLog>,
    @Inject('POINT_SERVICE') private pointClient: ClientProxy,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private mailService: MailService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExisting = await this.userRepository.findOneBy({
      email: createUserDto.email
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Usuario ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }
    const clientResponse = await firstValueFrom(
      this.pointClient.send('find_client_by_identification_number', { identificationNumber: createUserDto.identificationNumber }).pipe(
        catchError((err) => {
          if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new InternalServerErrorException({
              message: ['Ocurrió un error en su petición.'],
              error: 'Internal Server Error:',
              statusCode: 500
            });
          } else if (err.statusCode === 404) {
            return of(null);
          }
          throw new InternalServerErrorException();
        })
      )
    );

    if (clientResponse?.client != null) {
      throw new BadRequestException({
        message: ['Ya existe un usuario con su dni.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const securityEvent = await this.securityEventRepository.findOneBy({
      name: "REGISTER"
    });
    if (!securityEvent) {
      throw new NotFoundException({
        message: ['Evento de seguridad no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const savedUserToken = await this.dataSource.transaction(async manager => {
      const userRepository = manager.getRepository(User);
      const securityLogRepository = manager.getRepository(SecurityLog);

      const newUser = userRepository.create({
        name: createUserDto.name,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: hashedPassword,
        tokenVersion: 1,
        isSuperAdmin: false
      });
      const savedUser = await userRepository.save(newUser);

      const payload = {
        sub: savedUser.id,
        tokenVersion: savedUser.tokenVersion
      };
      const token = this.jwtService.sign(payload);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      const newSecurityLog = securityLogRepository.create({
        data: token,
        used: false,
        user: savedUser,
        securityEvent: securityEvent,
      });
      await securityLogRepository.save(newSecurityLog);

      return { user: savedUser, token };
    });

    await firstValueFrom(
      this.pointClient.send('create_client', { identificationNumber: createUserDto.identificationNumber, userId: savedUserToken.user.id, isInternal: false }).pipe(
        catchError(() => of(null))
      )
    );

    await this.mailService.sendAccountVerificationEmail(createUserDto.email, savedUserToken.token);

    return { user: savedUserToken.user };
  }

  async validateToken(userId: number) {
    const securityLog = await this.securityLogRepository.findOneBy({
      user: { id: userId }, securityEvent: { name: "REGISTER" }
    });
    if (!securityLog) {
      throw new UnauthorizedException({
        message: ['Problema con la validación de su cuenta.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    if (securityLog.used) {
      throw new BadRequestException({
        message: ['El usuario ya ha sido validado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const expirationDate = securityLog.createdAt;
    expirationDate.setDate(expirationDate.getDate() + 1);

    if (expirationDate < new Date()) {
      throw new UnauthorizedException({
        message: ['Su validación de correo ha expirado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    await this.securityLogRepository.update(securityLog.id, { used: true });

    return { message: 'success' };
  }

  async quickStart(userQuickStartDto: UserQuickStartDto) {
    const userExisting = await this.userRepository.findOneBy({
      email: userQuickStartDto.email
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Correo ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    await firstValueFrom(
      this.adminClient.send('find_onboarding_session_by_id_to_validate', { id: userQuickStartDto.onboardingSessionId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Onboarding no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const newUser = this.userRepository.create({
      name: '',
      lastName: '',
      email: userQuickStartDto.email,
      password: '',
      tokenVersion: 1,
      isSuperAdmin: false,
      isPending: true,
      onboardingSessionId: userQuickStartDto.onboardingSessionId,
    });

    const savedUser = await this.userRepository.save(newUser);

    await firstValueFrom(
      this.adminClient.send('update_onboarding_session_to_linked', { id: userQuickStartDto.onboardingSessionId }).pipe(
        catchError(() => of(null))
      )
    );

    const payload = {
      sub: savedUser.id,
      tokenVersion: savedUser.tokenVersion
    };
    const token = this.jwtService.sign(payload);

    await this.mailService.sendQuickStartEmail(userQuickStartDto.email, token);

    return { user: savedUser };
  }

  async completeOnboarding(userId: number, completeOnboardingDto: CompleteOnboardingDto) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    if (!user.isPending) {
      throw new BadRequestException({
        message: ['El usuario ya ha completado su registro.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    const clientResponse = await firstValueFrom(
      this.pointClient.send('find_client_by_identification_number', { identificationNumber: completeOnboardingDto.identificationNumber }).pipe(
        catchError((err) => {
          if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new InternalServerErrorException({
              message: ['Ocurrió un error en su petición.'],
              error: 'Internal Server Error:',
              statusCode: 500
            });
          } else if (err.statusCode === 404) {
            return of(null);
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const onboardingSessionResponse = await firstValueFrom(
      this.adminClient.send('find_onboarding_session_by_id', { id: user.onboardingSessionId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Onboarding no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    if (clientResponse?.client != null) {
      throw new BadRequestException({
        message: ['Ya existe un cliente con su dni.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const securityEvent = await this.securityEventRepository.findOneBy({
      name: "ONBOARDING"
    });
    if (!securityEvent) {
      throw new NotFoundException({
        message: ['Evento de seguridad no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const hashedPassword = await bcrypt.hash(completeOnboardingDto.password, 10);

    await this.dataSource.transaction(async manager => {
      const userRepository = manager.getRepository(User);
      const securityLogRepository = manager.getRepository(SecurityLog);

      await userRepository.update(user.id, {
        name: completeOnboardingDto.name,
        lastName: completeOnboardingDto.lastName,
        password: hashedPassword,
        isPending: false,
      });

      const newSecurityLog = securityLogRepository.create({
        data: 'ONBOARDING COMPLETED',
        used: true,
        user: user,
        securityEvent: securityEvent,
      });
      await securityLogRepository.save(newSecurityLog);
    });

    await firstValueFrom(
      this.adminClient.send('update_onboarding_session_to_used', { id: user.onboardingSessionId }).pipe(
        catchError(() => of(null))
      )
    );

    const clientCreatedResponse = await firstValueFrom(
      this.pointClient.send('create_client', { identificationNumber: completeOnboardingDto.identificationNumber, userId: user.id, isInternal: false }).pipe(
        catchError(() => of(null))
      )
    );

    await firstValueFrom(
      this.pointClient.send('create_card_from_onboarding', {
        clientId: clientCreatedResponse.client.id,
        companyId: onboardingSessionResponse.onboardingSession.companyProgram.company.id,
        companyProgramId: onboardingSessionResponse.onboardingSession.companyProgram.id,
        userProfileId: onboardingSessionResponse.onboardingSession.operatorUserProfileId,
        quantity: onboardingSessionResponse.onboardingSession.quantity,
        branchId: onboardingSessionResponse.onboardingSession.branch.id
      }).pipe(
        catchError(() => of(null))
      )
    );

    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    });
    if (!user) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    if (user.isPending) {
      throw new UnauthorizedException({
        message: ['Su perfil está incompleto. Por favor, complete su registro.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    const clientResponse = await firstValueFrom(
      this.pointClient.send('find_client_by_user_id', { userId: user.id }).pipe(
        catchError((err) => {
          if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new InternalServerErrorException({
              message: ['Ocurrió un error en su petición.'],
              error: 'Internal Server Error:',
              statusCode: 500
            });
          }
          return of(null);
        })
      )
    );

    if (clientResponse?.client != null && clientResponse.client.isInternal === false) {
      if (user.onboardingSessionId) {
        const securityLog = await this.securityLogRepository.findOne({
          where: {
            user: { id: user.id },
            securityEvent: { name: "ONBOARDING" }
          },
        });
        if (!securityLog) {
          throw new UnauthorizedException({
            message: ['Problema con la validación de su cuenta.'],
            error: "Unauthorized",
            statusCode: 401
          });
        }
      } else {
        const securityLog = await this.securityLogRepository.findOne({
          where: {
            user: { id: user.id },
            securityEvent: { name: "REGISTER" }
          },
        });
        if (!securityLog) {
          throw new UnauthorizedException({
            message: ['Problema con la validación de su cuenta.'],
            error: "Unauthorized",
            statusCode: 401
          });
        }

        if (!securityLog.used) {
          throw new UnauthorizedException({
            message: ['Necesita validar su correo con el enlace que le hemos enviado.'],
            error: "Unauthorized",
            statusCode: 401
          });
        }
      }
    }

    const passwordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { user };
  }

  async findByCompanyId(companyId: number) {
    const users = await this.userRepository.find({
      where: { userProfiles: { profile: { companyId: companyId } } },
      relations: ['userProfiles', 'userProfiles.profile']
    });
    if (users.length === 0) {
      throw new NotFoundException({
        message: ['Usuarios no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { users };
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.userRepository.update(id, updateUserDto);

    return this.findById(id);
  }

  async generateTokenFromProfileToken(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async verifyPendingUser(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    if (!user.isPending) {
      throw new BadRequestException({
        message: ['El usuario no está en estado pendiente.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    if (!user.onboardingSessionId) {
      throw new BadRequestException({
        message: ['El usuario no tiene una sesión de onboarding asociada.'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    await firstValueFrom(
      this.adminClient.send('find_onboarding_session_by_id', { id: user.onboardingSessionId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Onboarding no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    return { user };
  }

  async findByIdToValidateToken(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { user };
  }
}
