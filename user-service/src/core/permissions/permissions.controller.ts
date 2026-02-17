import { Controller } from '@nestjs/common';
import {PermissionsService} from "./permissions.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreatePermissionDto} from "./dto/create-permission.dto";

@Controller('permissions')
export class PermissionsController {

  constructor(private permissionsService: PermissionsService) {}

  @MessagePattern('create_permission')
  async createPermission(data: CreatePermissionDto) {
    try {
      return await this.permissionsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
