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

  @Get('context-options/:userId')
  getById(@Param('userId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) userId: number) {
    return this.userProfilesService.findContextOptions(userId);
  }

  @Get('my-context-options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getProfile(@Request() req: any) {
    return this.userProfilesService.findContextOptions(req.user.id);
  }
}
