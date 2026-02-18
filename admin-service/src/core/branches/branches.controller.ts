import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {BranchesService} from "./branches.service";
import {CreateBranchDto} from "./dto/create-branch.dto";

@Controller('branches')
export class BranchesController {

  constructor(private branchesService: BranchesService) {}

  @MessagePattern('create_branch')
  async createBranch(data: CreateBranchDto) {
    try {
      return await this.branchesService.create(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_branch_by_id')
  async findById(data: { id: number }) {
    try {
      return await this.branchesService.findById(data.id);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
