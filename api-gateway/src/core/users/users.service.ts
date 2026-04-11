import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import {UserQuickStartDto} from "./dto/user-quick-start.dto";

@Injectable()
export class UsersService {

  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersClient.send('create_user', createUserDto).pipe(
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
        } else if (err.statusCode === 500) {
          throw new InternalServerErrorException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  validateToken(id: number) {
    return this.usersClient.send('validate_token', { id }).pipe(
      catchError(err => {
        if (err.statusCode === 400) {
          throw new BadRequestException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        } else if (err.statusCode === 401) {
          throw new UnauthorizedException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  quickStart(userQuickStartDto: UserQuickStartDto) {
    return this.usersClient.send('quick_start', userQuickStartDto).pipe(
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

  login(loginUserDto: LoginUserDto) {
    return this.usersClient.send('login', loginUserDto).pipe(
      catchError(err => {
        if (err.statusCode === 401) {
          throw new UnauthorizedException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        } else if (err.statusCode === 500) {
          throw new InternalServerErrorException({
            message: err.message,
            error: err.error,
            statusCode: err.statusCode
          });
        }
        throw new InternalServerErrorException();
      })
    );
  }

  findById(id: number) {
    return this.usersClient.send('find_user_by_id', { id }).pipe(
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
    );
  }

  findByCompanyId(companyId: number) {
    return this.usersClient.send('find_users_by_company_id', { companyId }).pipe(
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

  findByIdToValidateToken(id: number) {
    return this.usersClient.send('find_user_by_id_to_validate_token', { id }).pipe(
      catchError(err => {
        if (err.statusCode === 404) {
          throw new NotFoundException(err.message);
        }
        throw new InternalServerErrorException();
      })
    );
  }

  updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.usersClient.send('update_user_by_id', { id, updateUserDto }).pipe(
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

  generateTokenFromProfileToken(id: number) {
    return this.usersClient.send('generate_token_from_profile_token', { id }).pipe(
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
    );
  }
}
