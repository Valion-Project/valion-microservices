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
import {UpdateRewardDto} from "./dto/update-reward.dto";
import {RewardsService} from "./rewards.service";
import {CreateRewardDto} from "./dto/create-reward.dto";

@Controller('rewards')
export class RewardsController {

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

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.updateById(id, updateRewardDto);
  }
}
