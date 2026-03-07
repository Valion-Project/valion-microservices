import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfilesService} from "./profiles.service";
import {CreateOnboardingProfileDto} from "./dto/create-onboarding-profile.dto";
import {UpdateProfileDto} from "./dto/update-profile.dto";

@Controller('profiles')
export class ProfilesController {

  constructor(private profilesService: ProfilesService) {}

  @MessagePattern('create_profile')
  async createProfile(data: CreateProfileDto) {
    try {
      return await this.profilesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('create_onboarding_profile')
  async createOnboardingProfile(data: { companyId: number, onboardingProfile: CreateOnboardingProfileDto }) {
    try {
      return await this.profilesService.createOnboardingProfile(data.companyId, data.onboardingProfile);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_profiles_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.profilesService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_profile_by_id')
  async updateProfileById(data: { id: number, updateProfileDto: UpdateProfileDto }) {
    try {
      return await this.profilesService.updateById(data.id, data.updateProfileDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
