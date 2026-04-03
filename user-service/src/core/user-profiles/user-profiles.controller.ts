import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {UserProfilesService} from "./user-profiles.service";
import {CreateUserProfileDto} from "./dto/create-user-profile.dto";
import {CreateUserProfileAndUserDto} from "./dto/create-user-profile-and-user.dto";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";

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

  @MessagePattern('create_user_profile_and_user')
  async CreateUserProfileAndUser(data: CreateUserProfileAndUserDto) {
    try {
      return await this.userProfilesService.createUserProfileAndUser(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_user_profile_by_id')
  async findById(data: { id: number }) {
    try {
      return await this.userProfilesService.findById(data.id);
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

  @MessagePattern('generate_profile_token')
  async generateProfileToken(data: { userId: number, type: string, userProfileId: number }) {
    try {
      return await this.userProfilesService.generateProfileToken(data.userId, data.type, data.userProfileId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('validate_profile_token')
  async validateProfileToken(data: { userId: number, type: string, userProfileId: number }) {
    try {
      return await this.userProfilesService.validateProfileToken(data.userId, data.type, data.userProfileId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_user_profile_availability_in_profiles')
  async findUserProfileAvailabilityInProfiles(data: { companyId: number, userId: number }) {
    try {
      return await this.userProfilesService.findUserProfileAvailabilityInProfiles(data.companyId, data.userId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_user_profile_by_id')
  async updateRewardBranchById(data: { id: number, updateUserProfileDto: UpdateUserProfileDto }) {
    try {
      return await this.userProfilesService.updateById(data.id, data.updateUserProfileDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
