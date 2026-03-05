import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {BranchesService} from "./branches.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {UpdateBranchDto} from "./dto/update-branch.dto";

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

  @MessagePattern('find_branches_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.branchesService.findByCompanyId(data.companyId);
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

  @MessagePattern('update_branch_by_id')
  async updateBranchById(data: { id: number, updateBranchDto: UpdateBranchDto }) {
    try {
      return await this.branchesService.updateById(data.id, data.updateBranchDto);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
