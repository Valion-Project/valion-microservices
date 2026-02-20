import {BadRequestException, Controller, Get, Param, ParseIntPipe, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {UserProfilesService} from "./user-profiles.service";

@Controller('user-profiles')
export class UserProfilesController {

  constructor(private userProfilesService: UserProfilesService) {}

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
