import { Controller } from '@nestjs/common';
import {UsersService} from "./users.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import {UserQuickStartDto} from "./dto/user-quick-start.dto";

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

  @MessagePattern('validate_token')
  async validateToken(data: { id: number }) {
    try {
      return await this.usersService.validateToken(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('quick_start')
  async quickStart(data: UserQuickStartDto) {
    try {
      return await this.usersService.quickStart(data);
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

  @MessagePattern('find_users_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.usersService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_user_by_id')
  async updateUserById(data: { id: number, updateUserDto: UpdateUserDto }) {
    try {
      return await this.usersService.updateById(data.id, data.updateUserDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('generate_token_from_profile_token')
  async generateTokenFromProfileToken(data: { id: number }) {
    try {
      return await this.usersService.generateTokenFromProfileToken(data.id);
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
