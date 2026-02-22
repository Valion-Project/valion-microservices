import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SecurityEvent} from "./entity/security-events.entity";
import {Repository} from "typeorm";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";
import {UpdateSecurityEventDto} from "./dto/update-security-event.dto";

@Injectable()
export class SecurityEventsService {

  constructor(
    @InjectRepository(SecurityEvent) private securityEventRepository: Repository<SecurityEvent>,
  ) {}

  async create(createSecurityEventDto: CreateSecurityEventDto) {
    const securityEventExisting = await this.securityEventRepository.findOneBy({
      name: createSecurityEventDto.name
    });
    if (securityEventExisting) {
      throw new BadRequestException({
        message: ['Evento de seguridad ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newSecurityEvent = this.securityEventRepository.create({
      name: createSecurityEventDto.name,
      description: createSecurityEventDto.description,
    });
    const savedSecurityEvent = await this.securityEventRepository.save(newSecurityEvent);

    return { securityEvent: savedSecurityEvent };
  }

  async findAll() {
    const securityEvents = await this.securityEventRepository.find();
    if (securityEvents.length === 0) {
      throw new NotFoundException({
        message: ['Eventos de seguridad no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { securityEvents };
  }

  async findById(id: number) {
    const securityEvent = await this.securityEventRepository.findOneBy({
      id
    });
    if (!securityEvent) {
      throw new NotFoundException({
        message: ['Evento de seguridad no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { securityEvent };
  }

  async updateById(id: number, updateSecurityEventDto: UpdateSecurityEventDto) {
    const securityEvent = await this.securityEventRepository.findOneBy({
      id
    });
    if (!securityEvent) {
      throw new NotFoundException({
        message: ['Evento de seguridad no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.securityEventRepository.update(id, updateSecurityEventDto);

    return this.findById(id);
  }
}
