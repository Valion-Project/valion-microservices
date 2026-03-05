import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {LevelsService} from "./levels.service";
import {CreateLevelDto} from "./dto/create-level.dto";
import {UpdateLevelDto} from "./dto/update-level.dto";

@Controller('levels')
export class LevelsController {

  constructor(private levelsService: LevelsService) {}

  @MessagePattern('create_level')
  async createLevel(data: CreateLevelDto) {
    try {
      return await this.levelsService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_levels_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.levelsService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('update_level_by_id')
  async updateLevelById(data: { id: number, updateLevelDto: UpdateLevelDto }) {
    try {
      return await this.levelsService.updateById(data.id, data.updateLevelDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}