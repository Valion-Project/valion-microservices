import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {ProfilePermissionsService} from "./profile-permissions.service";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";

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
}
