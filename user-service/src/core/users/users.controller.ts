import { Controller } from '@nestjs/common';
import {UsersService} from "./users.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @MessagePattern('find_by_id')
  async getById(data: { id: number }) {
    try {
      return await this.usersService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_by_id_to_validate_token')
  async getByIdToValidateToken(data: { id: number }) {
    try {
      return await this.usersService.findByIdToValidateToken(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
