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
import {LevelsService} from "./levels.service";
import {CreateLevelDto} from "./dto/create-level.dto";
import {UpdateLevelDto} from "./dto/update-level.dto";

@Controller('levels')
export class LevelsController {

  constructor(private levelsService: LevelsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get('company/:companyId')
  getAll(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.levelsService.findByCompanyId(companyId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.updateById(id, updateLevelDto);
  }
}
