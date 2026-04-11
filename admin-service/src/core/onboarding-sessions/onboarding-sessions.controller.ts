import { Controller } from '@nestjs/common';
import {OnboardingSessionsService} from "./onboarding-sessions.service";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {CreateOnboardingSessionDto} from "./dto/create-onboarding-session.dto";

@Controller('onboarding-sessions')
export class OnboardingSessionsController {

  constructor(private onboardingSessionsService: OnboardingSessionsService) {}

  @MessagePattern('create_onboarding_session')
  async createOnboardingSession(data: CreateOnboardingSessionDto) {
    try {
      return await this.onboardingSessionsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_onboarding_session_by_id')
  async findById(data: { id: string }) {
    try {
      return await this.onboardingSessionsService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
