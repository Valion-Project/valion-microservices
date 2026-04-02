import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CompanyProgram} from "./entity/company-programs.entity";
import {Repository} from "typeorm";
import {LoyaltyProgram} from "../loyalty-programs/entity/loyalty-programs.entity";
import {Company} from "../companies/entity/companies.entity";
import {CreateCompanyProgramDto} from "./dto/create-company-program.dto";

@Injectable()
export class CompanyProgramsService {

  constructor(
    @InjectRepository(CompanyProgram) private companyProgramRepository: Repository<CompanyProgram>,
    @InjectRepository(LoyaltyProgram) private loyaltyProgramRepository: Repository<LoyaltyProgram>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyProgramDto: CreateCompanyProgramDto) {
    const companyProgramExisting = await this.companyProgramRepository.findOneBy({
      company: { id: createCompanyProgramDto.companyId },
      loyaltyProgram: { id: createCompanyProgramDto.loyaltyProgramId }
    });
    if (companyProgramExisting) {
      throw new BadRequestException({
        message: ['Programa de fidelidad en empresa ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const company = await this.companyRepository.findOneBy({
      id: createCompanyProgramDto.companyId
    });
    if (!company) {
      throw new BadRequestException({
        message: ['Empresa no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const loyaltyProgram = await this.loyaltyProgramRepository.findOneBy({
      id: createCompanyProgramDto.loyaltyProgramId
    });
    if (!loyaltyProgram) {
      throw new BadRequestException({
        message: ['Programa de fidelidad no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    const newCompanyProgram = this.companyProgramRepository.create({
      company: company,
      loyaltyProgram: loyaltyProgram
    });
    const savedCompanyProgram = await this.companyProgramRepository.save(newCompanyProgram);

    return { companyProgram: savedCompanyProgram };
  }

  async findById(id: number) {
    const companyProgram = await this.companyProgramRepository.findOne({
      where: { id },
      relations: ['company', 'loyaltyProgram']
    });
    if (!companyProgram) {
      throw new NotFoundException({
        message: ['Empresa no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { companyProgram };
  }

  async findCompanyProgramAvailabilityInLoyaltyPrograms(companyId: number) {
    const loyaltyPrograms = await this.loyaltyProgramRepository.find();
    const company = await this.companyRepository.findOneBy({
      id: companyId
    });

    const companyPrograms: CompanyProgram[] = [];

    for (const loyaltyProgram of loyaltyPrograms) {
      const companyProgram = await this.companyProgramRepository.findOne({
        where: { loyaltyProgram: { id: loyaltyProgram.id }, company: { id: companyId } },
        relations: ['company', 'loyaltyProgram']
      });
      if (companyProgram) {
        companyPrograms.push(companyProgram);
      } else {
        const companyProgram = {
          company: company,
          loyaltyProgram: loyaltyProgram,
        } as CompanyProgram;
        companyPrograms.push(companyProgram);
      }
    }

    return { companyPrograms };
  }

  async findCompanyProgramAvailabilityInCompanies(loyaltyProgramId: number) {
    const companies = await this.companyRepository.find();
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneBy({
      id: loyaltyProgramId
    });

    const companyPrograms: CompanyProgram[] = [];

    for (const company of companies) {
      const companyProgram = await this.companyProgramRepository.findOne({
        where: { company: { id: company.id }, loyaltyProgram: { id: loyaltyProgramId } },
        relations: ['company', 'loyaltyProgram']
      });
      if (companyProgram) {
        companyPrograms.push(companyProgram);
      } else {
        const companyProgram = {
          company: company,
          loyaltyProgram: loyaltyProgram,
        } as CompanyProgram;
        companyPrograms.push(companyProgram);
      }
    }

    return { companyPrograms };
  }
}
