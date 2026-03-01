import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfilesService} from "./profiles.service";
import {CreateOnboardingProfileDto} from "./dto/create-onboarding-profile.dto";

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
}
