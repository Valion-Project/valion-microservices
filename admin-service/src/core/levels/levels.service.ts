import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Level} from "./entity/levels.entity";
import {DataSource, Repository} from "typeorm";
import {CreateLevelDto} from "./dto/create-level.dto";
import {Company} from "../companies/entity/companies.entity";
import {UpdateLevelDto} from "./dto/update-level.dto";

@Injectable()
export class LevelsService {

  constructor(
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private dataSource: DataSource,
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

    if (createLevelDto.isDefault) {
      const defaultLevelExisting = await this.levelRepository.findOneBy({
        company: { id: createLevelDto.companyId },
        isDefault: true
      });
      if (defaultLevelExisting) {
        throw new BadRequestException({
          message: ['Ya existe un nivel por defecto para esta empresa.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
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
      isDefault: createLevelDto.isDefault ?? false,
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

  async findDefaultByCompanyId(companyId: number) {
    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new BadRequestException({
        message: ['Empresa no encontrada.'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const level = await this.levelRepository.findOne({
      where: { company: { id: companyId }, isDefault: true },
      relations: ['company']
    });

    if (!level) {
      throw new NotFoundException({
        message: ['Nivel por defecto no encontrado para esta empresa.'],
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return { level };
  }

  async updateById(id: number, updateLevelDto: UpdateLevelDto) {
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

    if (updateLevelDto.isDefault && !level.isDefault) {
      const defaultLevel = await this.levelRepository.findOneBy({
        company: { id: level.company.id },
        isDefault: true
      });
      if (defaultLevel && defaultLevel.id !== id) {
        throw new BadRequestException({
          message: ['Ya existe un nivel por defecto para esta empresa.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    } else if (!updateLevelDto.isDefault && level.isDefault) {
      if (updateLevelDto.newDefaultLevelId === undefined || updateLevelDto.newDefaultLevelId === null) {
        throw new BadRequestException({
          message: ['Nuevo nivel por defecto no enviado.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      const newDefaultLevel = await this.levelRepository.findOneBy({
        id: updateLevelDto.newDefaultLevelId,
        company: { id: level.company.id }
      });

      if (!newDefaultLevel) {
        throw new BadRequestException({
          message: ['El nuevo nivel por defecto no existe.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      if (newDefaultLevel.id === id) {
        throw new BadRequestException({
          message: ['El nuevo nivel por defecto no puede ser el mismo que se está actualizando.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      // Transacción: actualizar nuevo por defecto y el nivel actual de forma atómica
      await this.dataSource.transaction(async manager => {
        const levelRepository = manager.getRepository(Level);

        await levelRepository.update(newDefaultLevel.id, { isDefault: true });

        const { newDefaultLevelId, ...updateData } = updateLevelDto;
        await levelRepository.update(id, updateData);
      });

      return this.findById(id);
    }

    const { newDefaultLevelId, ...updateData } = updateLevelDto;
    await this.levelRepository.update(id, updateData);

    return this.findById(id);
  }
}