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
import {RewardsService} from "./rewards.service";
import {CreateRewardDto} from "./dto/create-reward.dto";
import {UpdateRewardDto} from "./dto/update-reward.dto";

@Controller('rewards-dev')
export class RewardsDevController {

  constructor(private rewardsService: RewardsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get('company/:companyId')
  getByCompanyId(@Param('companyId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyId: number) {
    return this.rewardsService.findByCompanyId(companyId);
  }

  @Get('company-program/:companyProgramId')
  getByCompanyProgramId(@Param('companyProgramId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) companyProgramId: number) {
    return this.rewardsService.findByCompanyProgramId(companyProgramId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.updateById(id, updateRewardDto);
  }
}
