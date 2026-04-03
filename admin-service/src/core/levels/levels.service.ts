import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Level} from "./entity/levels.entity";
import {Repository} from "typeorm";
import {CreateLevelDto} from "./dto/create-level.dto";
import {Company} from "../companies/entity/companies.entity";
import {UpdateLevelDto} from "./dto/update-level.dto";

@Injectable()
export class LevelsService {

  constructor(
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
    const levelExisting = await this.levelRepository.findOneBy([{
      name: createLevelDto.name,
      company: { id: createLevelDto.companyId }
    }, {
      multiplier: createLevelDto.multiplier,
      company: { id: createLevelDto.companyId }
    }]);
    if (levelExisting) {
      throw new BadRequestException({
        message: ['Nivel ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const company = await this.companyRepository.findOneBy({
      id: createLevelDto.companyId
    });
    if (!company) {
      throw new BadRequestException({
        message: ['Empresa no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newLevel = this.levelRepository.create({
      name: createLevelDto.name,
      multiplier: createLevelDto.multiplier,
      company: company
    });
    const savedLevel = await this.levelRepository.save(newLevel);

    return { level: savedLevel };
  }

  async findByCompanyId(companyId: number) {
    const levels = await this.levelRepository.findBy({
      company: { id: companyId }
    });
    if (levels.length === 0) {
      throw new NotFoundException({
        message: ['Niveles no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { levels };
  }

  async findById(id: number) {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: ['company']
    });
    if (!level) {
      throw new NotFoundException({
        message: ['Nivel no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { level };
  }

  async updateById(id: number, updateLevelDto: UpdateLevelDto) {
    const level = await this.levelRepository.findOneBy({
      id
    });
    if (!level) {
      throw new NotFoundException({
        message: ['Nivel no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.levelRepository.update(id, updateLevelDto);

    return this.findById(id);
  }
}