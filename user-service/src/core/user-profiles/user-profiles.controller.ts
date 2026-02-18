import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {UserProfilesService} from "./user-profiles.service";
import {CreateUserProfileDto} from "./dto/create-user-profile.dto";

@Controller('user-profiles')
export class UserProfilesController {

  constructor(private userProfilesService: UserProfilesService) {}

  @MessagePattern('create_user_profile')
  async createUserProfile(data: CreateUserProfileDto) {
    try {
      return await this.userProfilesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_context_options')
  async findContextOptions(data: { userId: number }) {
    try {
      return await this.userProfilesService.findContextOptions(data.userId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
