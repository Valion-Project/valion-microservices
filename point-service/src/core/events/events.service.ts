import {BadRequestException, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Event} from "./entity/events.entity";
import {DataSource, Repository} from "typeorm";
import {EventType} from "../event-types/entity/event-types.entity";
import {Card} from "../cards/entity/cards.entity";
import {Reward} from "../rewards/entity/rewards.entity";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {catchError, firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(EventType) private readonly eventTypeRepository: Repository<EventType>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(Reward) private readonly rewardRepository: Repository<Reward>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    private dataSource: DataSource,
  ) {}

  async createEventAdd(createEventAddDto: CreateEventAddDto) {
    const eventType = await this.eventTypeRepository.findOneBy({
      name: "SUMA"
    });
    if (!eventType) {
      throw new BadRequestException({
        message: ['Tipo de evento no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const card = await this.cardRepository.findOneBy({
      id: createEventAddDto.cardId
    });
    if (!card) {
      throw new BadRequestException({
        message: ['Tarjeta no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const companyProgramCardResponse = await firstValueFrom(
      this.adminClient.send('find_company_program_by_id', { id: card.companyProgramId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Programa de fidelidad en la empresa no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const userProfileResponse = await firstValueFrom(
      this.userClient.send('find_user_profile_by_id', { id: createEventAddDto.userProfileId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Programa de fidelidad en la empresa no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    if (userProfileResponse.userProfile.profile.domain !== "OPERATOR") {
      throw new BadRequestException({
        message: ['Usuario no es operador'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (card.companyId !== userProfileResponse.userProfile.branch.company.id) {
      throw new BadRequestException({
        message: ['Empresa del operador y tarjeta diferentes'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (createEventAddDto.points > 0 && createEventAddDto.visits > 0) {
      throw new BadRequestException({
        message: ['No pueden agregarse puntos y visitas'],
        error: "Bad Request",
        statusCode: 400
      });
    } else if (createEventAddDto.points > 0 && companyProgramCardResponse.companyProgram.loyaltyProgram.name !== 'POINTS') {
      throw new BadRequestException({
        message: ['Tipo de tarjeta incorrecto'],
        error: "Bad Request",
        statusCode: 400
      });
    } else if (createEventAddDto.visits > 0 && companyProgramCardResponse.companyProgram.loyaltyProgram.name !== 'VISITS') {
      throw new BadRequestException({
        message: ['Tipo de tarjeta incorrecto'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const savedEvent = await this.dataSource.transaction(async manager => {
      const eventRepository = manager.getRepository(Event);
      const cardRepository = manager.getRepository(Card);

      if (createEventAddDto.points > 0) {
        const points = card.points + createEventAddDto.points;
        await cardRepository.update(card.id, { points: points });
      } else {
        const visits = card.visits + createEventAddDto.visits;
        await cardRepository.update(card.id, { visits: visits });
      }

      const newEvent = eventRepository.create({
        ...(createEventAddDto.points > 0 ? { points: createEventAddDto.points } : { visits: createEventAddDto.visits }),
        operatorUserId: userProfileResponse.userProfile.user.id,
        branchId: userProfileResponse.userProfile.branchId,
        eventType: eventType,
        card: card
      });
      const savedEvent = await eventRepository.save(newEvent);

      return { event: savedEvent };
    });

    return { event: savedEvent.event };
  }

  async createEventRedeem(createEventRedeemDto: CreateEventRedeemDto) {
    const eventType = await this.eventTypeRepository.findOneBy({
      name: "CANJE"
    });
    if (!eventType) {
      throw new BadRequestException({
        message: ['Tipo de evento no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const card = await this.cardRepository.findOneBy({
      id: createEventRedeemDto.cardId
    });
    if (!card) {
      throw new BadRequestException({
        message: ['Tarjeta no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const reward = await this.rewardRepository.findOneBy({
      id: createEventRedeemDto.rewardId
    });
    if (!reward) {
      throw new BadRequestException({
        message: ['Recompensa no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const companyProgramCardResponse = await firstValueFrom(
      this.adminClient.send('find_company_program_by_id', { id: card.companyProgramId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Programa de fidelidad en la empresa no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const userProfileResponse = await firstValueFrom(
      this.userClient.send('find_user_profile_by_id', { id: createEventRedeemDto.userProfileId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Programa de fidelidad en la empresa no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    if (userProfileResponse.userProfile.profile.domain !== "OPERATOR") {
      throw new BadRequestException({
        message: ['Usuario no es operador'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (card.companyId !== userProfileResponse.userProfile.branch.company.id ||
        reward.companyId !== userProfileResponse.userProfile.branch.company.id) {
      throw new BadRequestException({
        message: ['Empresa del operador, tarjeta y recompensa diferentes'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const loyaltyType = companyProgramCardResponse.companyProgram.loyaltyProgram.name;

    if (loyaltyType === 'POINTS') {
      if (reward.pointCost === null || reward.pointCost === undefined) {
        throw new BadRequestException({
          message: ['La recompensa no tiene costo en puntos'],
          error: 'Bad Request',
          statusCode: 400
        });
      }

      if (reward.pointCost > card.points) {
        throw new BadRequestException({
          message: ['La tarjeta no tiene puntos suficientes para canjear la recompensa'],
          error: 'Bad Request',
          statusCode: 400
        });
      }
    } else if (loyaltyType === 'VISITS') {
      if (reward.visitCost === null || reward.visitCost === undefined) {
        throw new BadRequestException({
          message: ['La recompensa no tiene costo en visitas'],
          error: 'Bad Request',
          statusCode: 400
        });
      }

      if (reward.visitCost > card.visits) {
        throw new BadRequestException({
          message: ['La tarjeta no tiene visitas suficientes para canjear la recompensa'],
          error: 'Bad Request',
          statusCode: 400
        });
      }
    } else {
      throw new BadRequestException({
        message: ['Tipo de programa de fidelidad inválido'],
        error: 'Bad Request',
        statusCode: 400
      });
    }

    const savedEvent = await this.dataSource.transaction(async manager => {
      const eventRepository = manager.getRepository(Event);
      const cardRepository = manager.getRepository(Card);

      if (loyaltyType === 'POINTS') {
        const points = card.points - reward.pointCost;
        await cardRepository.update(card.id, { points: points });
      } else {
        const visits = card.visits - reward.visitCost;
        await cardRepository.update(card.id, { visits: visits });
      }

      const newEvent = eventRepository.create({
        ...(loyaltyType === 'POINTS' ? { points: reward.pointCost } : { visits: reward.visitCost }),
        operatorUserId: userProfileResponse.userProfile.user.id,
        branchId: userProfileResponse.userProfile.branchId,
        eventType: eventType,
        card: card,
        reward: reward
      });
      const savedEvent = await eventRepository.save(newEvent);

      return { event: savedEvent };
    });

    return { event: savedEvent.event };
  }
}
