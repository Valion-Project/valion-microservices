import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Company} from "../companies/entity/companies.entity";
import {Repository} from "typeorm";
import {Branch} from "./entity/branches.entity";
import {CreateBranchDto} from "./dto/create-branch.dto";

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branchExisting = await this.branchRepository.findOneBy({
      name: createBranchDto.name,
      company: { id: createBranchDto.companyId }
    });
    if (branchExisting) {
      throw new BadRequestException({
        message: ['Sucursal ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const company = await this.companyRepository.findOneBy({
      id: createBranchDto.companyId
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Empresa no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const newBranch = this.branchRepository.create({
      name: createBranchDto.name,
      address: createBranchDto.address,
      company: company
    });
    const savedBranch = await this.branchRepository.save(newBranch);

    return { branch: savedBranch };
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['company']
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }
}
