import {
  BadRequestException, Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes, ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {LoginUserDto} from "./dto/login-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import {UserQuickStartDto} from "./dto/user-quick-start.dto";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('validate-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  validateToken(@Request() req: any) {
    return this.usersService.validateToken(req.user.id);
  }

  @Post('quick-start')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  quickStart(@Body() userQuickStartDto: UserQuickStartDto) {
    return this.usersService.quickStart(userQuickStartDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('id/:id')
  getById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.usersService.findById(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyUser(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get('company/:companyId')
  getByCompanyId(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.usersService.findByCompanyId(companyId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(id, updateUserDto);
  }

  @Get('token-from-profile-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  generateTokenFromProfileToken(@Request() req: any) {
    return this.usersService.generateTokenFromProfileToken(req.user.id);
  }
}
