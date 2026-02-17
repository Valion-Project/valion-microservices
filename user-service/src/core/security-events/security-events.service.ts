import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SecurityEvent} from "./entity/security-events.entity";
import {Repository} from "typeorm";
import {CreateSecurityEventDto} from "./dto/create-security-event.dto";

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
}
