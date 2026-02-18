import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProfilePermissionsService} from "./profile-permissions.service";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";

@Controller('profile-permissions-dev')
export class ProfilePermissionsDevController {

  constructor(private profilePermissionsService: ProfilePermissionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProfilePermissionDto: CreateProfilePermissionDto) {
    return this.profilePermissionsService.create(createProfilePermissionDto);
  }
}
