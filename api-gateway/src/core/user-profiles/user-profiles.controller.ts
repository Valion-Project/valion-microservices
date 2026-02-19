import {BadRequestException, Controller, Get, Param, ParseIntPipe, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {UserProfilesService} from "./user-profiles.service";

@Controller('user-profiles')
export class UserProfilesController {

  constructor(private userProfilesService: UserProfilesService) {}

  @Get('context-options/:userId')
  getContextOptionsByUserId(@Param('userId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) userId: number) {
    return this.userProfilesService.findContextOptions(userId);
  }

  @Get('my-context-options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyContextOptions(@Request() req: any) {
    return this.userProfilesService.findContextOptions(req.user.id);
  }
}
