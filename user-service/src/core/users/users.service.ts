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

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SecurityEvent) private securityEventRepository: Repository<SecurityEvent>,
    @InjectRepository(SecurityLog) private securityLogRepository: Repository<SecurityLog>,
    @Inject('POINT_SERVICE') private pointClient: ClientProxy,
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
