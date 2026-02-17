import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Company} from "./entity/companies.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateCompanyDto} from "./dto/create-company.dto";

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const companyExisting = await this.companyRepository.findOneBy({
      name: createCompanyDto.name
    });
    if (companyExisting) {
      throw new BadRequestException({
        message: ['Empresa ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCompany = this.companyRepository.create({
      name: createCompanyDto.name
    });
    const savedCompany = await this.companyRepository.save(newCompany);

    return { company: savedCompany };
  }

  async findById(id: number) {
    const company = await this.companyRepository.findOneBy({
      id
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Empresa no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { company };
  }
}
