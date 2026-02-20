import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {UserProfilesService} from "./user-profiles.service";
import {CreateUserProfileDto} from "./dto/create-user-profile.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('user-profiles-dev')
export class UserProfilesDevController {

  constructor(private userProfilesService: UserProfilesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userProfilesService.create(createUserProfileDto);
  }

  @Get('my-context-options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyContextOptions(@Request() req: any) {
    return this.userProfilesService.findContextOptions(req.user.id);
  }

  @Get('my-profile-token/:type/:userProfileId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  generateMyProfileToken(@Request() req: any, @Param('type') type: string, @Param('userProfileId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) userProfileId: number) {
    return this.userProfilesService.generateProfileToken(req.user.id, type, userProfileId);
  }

  @Get('validate-profile-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  validateProfileToken(@Request() req: any) {
    return this.userProfilesService.validateProfileToken(req.user.type, req.user.userProfileId);
  }
}
