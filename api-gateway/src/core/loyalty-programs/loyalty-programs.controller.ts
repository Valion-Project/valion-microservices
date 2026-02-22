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
import {LoyaltyProgramsService} from "./loyalty-programs.service";
import {CreateLoyaltyProgramDto} from "./dto/create-loyalty-program.dto";
import {UpdateLoyaltyProgramDto} from "./dto/update-loyalty-program.dto";

@Controller('loyalty-programs')
export class LoyaltyProgramsController {

  constructor(private loyaltyProgramsService: LoyaltyProgramsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    return this.loyaltyProgramsService.create(createLoyaltyProgramDto);
  }

  @Get()
  getAll() {
    return this.loyaltyProgramsService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    return this.loyaltyProgramsService.updateById(id, updateLoyaltyProgramDto);
  }
}
