import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {ProfilePermissionsService} from "./profile-permissions.service";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";
import {UpdateProfilePermissionDto} from "./dto/update-profile-permission.dto";

@Controller('profile-permissions')
export class ProfilePermissionsController {

  constructor(private profilePermissionsService: ProfilePermissionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProfilePermissionDto: CreateProfilePermissionDto) {
    return this.profilePermissionsService.create(createProfilePermissionDto);
  }

  @Get('availability/permissions/:profileId')
  getProfilePermissionAvailabilityInPermissions(@Param('profileId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) profileId: number) {
    return this.profilePermissionsService.findProfilePermissionAvailabilityInPermissions(profileId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateProfilePermissionDto: UpdateProfilePermissionDto) {
    return this.profilePermissionsService.updateById(id, updateProfilePermissionDto);
  }
}
