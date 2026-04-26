import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {Company} from "./entity/companies.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDto} from "./dto/update-company.dto";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const companyExisting = await this.companyRepository.findOneBy({
      name: createCompanyDto.companyName
    });
    if (companyExisting) {
      throw new BadRequestException({
        message: ['Empresa ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCompany = this.companyRepository.create({
      name: createCompanyDto.companyName
    });
    const savedCompany = await this.companyRepository.save(newCompany);

    await firstValueFrom(
      this.userClient.send('create_onboarding_profile', { companyId: savedCompany.id, onboardingProfile: createCompanyDto }).pipe(
        catchError((err) => {
          if (err.statusCode === 404) {
            throw new NotFoundException({
              message: ['Ocurrió un error en su petición.'],
              error: 'Internal Server Error:',
              statusCode: 500
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    return { company: savedCompany };
  }

  async findAll() {
    const companies = await this.companyRepository.find({
      relations: ['companyPrograms', 'companyPrograms.loyaltyProgram']
    });
    if (companies.length === 0) {
      throw new NotFoundException({
        message: ['Empresas no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { companies };
  }

  async findById(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['companyPrograms', 'companyPrograms.loyaltyProgram']
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Empresa no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { company };
  }

  async updateById(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOneBy({
      id
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Empresa no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.companyRepository.update(id, updateCompanyDto);

    return this.findById(id);
  }
}
