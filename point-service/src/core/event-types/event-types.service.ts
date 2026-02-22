import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EventType} from "./entity/event-types.entity";
import {Repository} from "typeorm";
import {CreateEventTypeDto} from "./dto/create-event-type.dto";
import {UpdateEventTypeDto} from "./dto/update-event-type.dto";

@Injectable()
export class EventTypesService {

  constructor(
    @InjectRepository(EventType) private readonly eventTypeRepository: Repository<EventType>,
  ) {}

  async create(createEventTypeDto: CreateEventTypeDto) {
    const eventTypeExisting = await this.eventTypeRepository.findOneBy({
      name: createEventTypeDto.name,
    });
    if (eventTypeExisting) {
      throw new BadRequestException({
        message: ['Tipo de evento ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newEventType = this.eventTypeRepository.create({
      name: createEventTypeDto.name,
      description: createEventTypeDto.description,
    });
    const savedEventType = await this.eventTypeRepository.save(newEventType);

    return { eventType: savedEventType };
  }

  async findAll() {
    const eventTypes = await this.eventTypeRepository.find();
    if (eventTypes.length === 0) {
      throw new NotFoundException({
        message: ['Tipos de evento no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { eventTypes };
  }

  async findById(id: number) {
    const eventType = await this.eventTypeRepository.findOneBy({
      id
    });
    if (!eventType) {
      throw new NotFoundException({
        message: ['Tipo de evento no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { eventType };
  }

  async updateById(id: number, updateEventTypeDto: UpdateEventTypeDto) {
    const eventType = await this.eventTypeRepository.findOneBy({
      id
    });
    if (!eventType) {
      throw new NotFoundException({
        message: ['Tipo de evento no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.eventTypeRepository.update(id, updateEventTypeDto);

    return this.findById(id);
  }
}
