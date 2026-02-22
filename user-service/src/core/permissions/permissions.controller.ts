import { Controller } from '@nestjs/common';
import {PermissionsService} from "./permissions.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreatePermissionDto} from "./dto/create-permission.dto";
import {UpdatePermissionDto} from "./dto/update-permission.dto";

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

  @MessagePattern('find_all_permissions')
  async findAllPermissions() {
    try {
      return await this.permissionsService.findAll();
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_permission_by_id')
  async updatePermissionById(data: { id: number, updatePermissionDto: UpdatePermissionDto }) {
    try {
      return await this.permissionsService.updateById(data.id, data.updatePermissionDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
