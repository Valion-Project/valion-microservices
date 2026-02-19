import {
  BadRequestException, Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes, ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";

@Controller('users-dev')
export class UsersDevController {

  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('id/:id')
  getUserById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.usersService.findById(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyUser(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }
}
