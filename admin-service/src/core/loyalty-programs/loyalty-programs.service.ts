import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LoyaltyProgram} from "./entity/loyalty-programs.entity";
import {Repository} from "typeorm";
import {CreateLoyaltyProgramDto} from "./dto/create-loyalty-program.dto";
import {UpdateLoyaltyProgramDto} from "./dto/update-loyalty-program.dto";

@Injectable()
export class LoyaltyProgramsService {

  constructor(
    @InjectRepository(LoyaltyProgram) private loyaltyProgramRepository: Repository<LoyaltyProgram>,
  ) {}

  async create(createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    const loyaltyProgramExisting = await this.loyaltyProgramRepository.findOneBy({
      name: createLoyaltyProgramDto.name
    });
    if (loyaltyProgramExisting) {
      throw new BadRequestException({
        message: ['Programa de fidelidad ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newLoyaltyProgram = this.loyaltyProgramRepository.create({
      name: createLoyaltyProgramDto.name,
      description: createLoyaltyProgramDto.description
    });
    const savedLoyaltyProgram = await this.loyaltyProgramRepository.save(newLoyaltyProgram);

    return { loyaltyProgram: savedLoyaltyProgram };
  }

  async findAll() {
    const loyaltyPrograms = await this.loyaltyProgramRepository.find();
    if (loyaltyPrograms.length === 0) {
      throw new NotFoundException({
        message: ['Programas de fidelidad no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { loyaltyPrograms };
  }

  async findById(id: number) {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneBy({
      id
    });
    if (!loyaltyProgram) {
      throw new NotFoundException({
        message: ['Programa de fidelidad no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { loyaltyProgram };
  }

  async updateById(id: number, updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneBy({
      id
    });
    if (!loyaltyProgram) {
      throw new NotFoundException({
        message: ['Programa de fidelidad no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.loyaltyProgramRepository.update(id, updateLoyaltyProgramDto);

    return this.findById(id);
  }
}
