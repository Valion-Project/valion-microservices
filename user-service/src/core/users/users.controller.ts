import { Controller } from '@nestjs/common';
import {UsersService} from "./users.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @MessagePattern('create_user')
  async createUser(data: CreateUserDto) {
    try {
      return await this.usersService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('login')
  async login(data: LoginUserDto) {
    try {
      return await this.usersService.login(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_user_by_id')
  async findById(data: { id: number }) {
    try {
      return await this.usersService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_user_by_id_to_validate_token')
  async findByIdToValidateToken(data: { id: number }) {
    try {
      return await this.usersService.findByIdToValidateToken(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
