import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {LoyaltyProgramsService} from "./loyalty-programs.service";
import {UpdateLoyaltyProgramDto} from "./dto/update-loyalty-program.dto";
import {CreateLoyaltyProgramDto} from "./dto/create-loyalty-program.dto";

@Controller('loyalty-programs')
export class LoyaltyProgramsController {

  constructor(private loyaltyProgramsService: LoyaltyProgramsService) {}

  @MessagePattern('create_loyalty_program')
  async createLoyaltyProgram(data: CreateLoyaltyProgramDto) {
    try {
      return await this.loyaltyProgramsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_all_loyalty_programs')
  async findAllLoyaltyPrograms() {
    try {
      return await this.loyaltyProgramsService.findAll();
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_loyalty_program_by_id')
  async updateLoyaltyProgramById(data: { id: number, updateLoyaltyProgramDto: UpdateLoyaltyProgramDto }) {
    try {
      return await this.loyaltyProgramsService.updateById(data.id, data.updateLoyaltyProgramDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
