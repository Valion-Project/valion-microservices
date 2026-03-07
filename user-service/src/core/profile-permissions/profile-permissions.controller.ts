import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {ProfilePermissionsService} from "./profile-permissions.service";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";
import {UpdateProfilePermissionDto} from "./dto/update-profile-permission.dto";

@Controller('profile-permissions')
export class ProfilePermissionsController {

  constructor(private profilePermissionsService: ProfilePermissionsService) {}

  @MessagePattern('create_profile_permission')
  async createProfilePermission(data: CreateProfilePermissionDto) {
    try {
      return await this.profilePermissionsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_profile_permission_availability_in_permissions')
  async findProfilePermissionAvailabilityInPermissions(data: { profileId: number }) {
    try {
      return await this.profilePermissionsService.findProfilePermissionAvailabilityInPermissions(data.profileId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_profile_permission_by_id')
  async updateProfilePermissionById(data: { id: number, updateProfilePermissionDto: UpdateProfilePermissionDto }) {
    try {
      return await this.profilePermissionsService.updateById(data.id, data.updateProfilePermissionDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
