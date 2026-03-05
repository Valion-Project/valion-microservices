import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {ProfilesService} from "./profiles.service";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {UpdateProfileDto} from "./dto/update-profile.dto";

@Controller('profiles-dev')
export class ProfilesDevController {

  constructor(private profilesService: ProfilesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get('company/:companyId')
  getAllByCompanyId(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.profilesService.findAllByCompanyId(companyId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.updateById(id, updateProfileDto);
  }
}
