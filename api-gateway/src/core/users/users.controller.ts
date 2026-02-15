import {BadRequestException, Controller, Get, Param, ParseIntPipe, Request, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Get('id/:id')
  getById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.usersService.findById(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }
}
