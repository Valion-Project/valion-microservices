import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {OnboardingSessionsService} from "./onboarding-sessions.service";
import {CreateOnboardingSessionDto} from "./dto/create-onboarding-session.dto";

@Controller('onboarding-sessions-dev')
export class OnboardingSessionsDevController {

  constructor(private onboardingSessionsService: OnboardingSessionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createOnboardingSessionDto: CreateOnboardingSessionDto) {
    return this.onboardingSessionsService.create(createOnboardingSessionDto);
  }

  @Get('id/:id')
  getById(@Param('id') id: string) {
    return this.onboardingSessionsService.findById(id);
  }

  @Get('validate/:id')
  getByIdToValidate(@Param('id') id: string) {
    return this.onboardingSessionsService.findByIdToValidate(id);
  }
}
