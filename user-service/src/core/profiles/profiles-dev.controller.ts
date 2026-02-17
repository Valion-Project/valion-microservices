import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProfilesService} from "./profiles.service";
import {CreateProfileDto} from "./dto/create-profile.dto";

@Controller('profiles-dev')
export class ProfilesDevController {

  constructor(private profilesService: ProfilesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }
}
