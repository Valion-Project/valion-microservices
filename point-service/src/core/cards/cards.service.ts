import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { Card } from './entity/cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {Client} from "../clients/entity/clients.entity";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";
import {CreateCardDto} from "./dto/create-card.dto";

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const client = await this.clientRepository.findOneBy({
      userId: createCardDto.userId
    });
    if (!client) {
      throw new BadRequestException({
        message: ['Cliente no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const cardExisting = await this.cardRepository.findOne({
      where: { client: { id: client.id }, companyProgramId: createCardDto.companyProgramId }
    });
    if (cardExisting) {
      throw new BadRequestException({
        message: ['Tarjeta ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const companyResponse = await firstValueFrom(
      this.adminClient.send('find_company_by_id', { id: createCardDto.companyId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Empresa no encontrada.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const levelResponse = await firstValueFrom(
      this.adminClient.send('find_level_by_id', { id: createCardDto.levelId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Nivel no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const companyProgramResponse = await firstValueFrom(
      this.adminClient.send('find_company_program_by_id', { id: createCardDto.companyProgramId }).pipe(
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

    if (companyProgramResponse.companyProgram.loyaltyProgram.name !== 'POINTS' && companyProgramResponse.companyProgram.loyaltyProgram.name !== 'VISITS') {
      throw new BadRequestException({
        message: ['Programa de fidelidad en la empresa debe ser de tipo POINTS o VISITS.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (levelResponse.level.company.id !== companyResponse.company.id) {
      throw new BadRequestException({
        message: ['Nivel de empresa incorrecto'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (companyProgramResponse.companyProgram.company.id !== companyResponse.company.id) {
      throw new BadRequestException({
        message: ['Programa de fidelidad en la empresa incorrecto'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCard = this.cardRepository.create({
      ...(companyProgramResponse.companyProgram.loyaltyProgram.name === 'POINTS' ? { points: 0 } : { visits: 0 }),
      companyId: createCardDto.companyId,
      levelId: createCardDto.levelId,
      companyProgramId: createCardDto.companyProgramId,
      client: client
    });
    const savedCard = await this.cardRepository.save(newCard);

    return {
      card: {
        ...savedCard,
        company: companyResponse.company,
        level: levelResponse.level,
        companyProgram: companyProgramResponse.companyProgram,
      }
    }
  }

  async findByCompanyId(companyId: number) {
    const cards = await this.cardRepository.find({
      where: { companyId },
      relations: ['client']
    });
    if (cards.length === 0) {
      throw new NotFoundException({
        message: ['Tarjetas no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const cardsWithRelations = await Promise.all(
      cards.map(async card => {
        const levelResponse = await firstValueFrom(
          this.adminClient.send('find_level_by_id', { id: card.levelId }).pipe(
            catchError(err => {
              if (err.statusCode === 404) {
                throw new BadRequestException({
                  message: ['Nivel no encontrado.'],
                  error: 'Bad Request',
                  statusCode: 400
                });
              }
              throw new InternalServerErrorException();
            })
          )
        );

        const companyProgramResponse = await firstValueFrom(
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

        return {
          ...card,
          level: levelResponse.level,
          companyProgram: companyProgramResponse.companyProgram
        };
      })
    );

    return { cards: cardsWithRelations };
  }

   async findByClientId(clientId: number) {
     const cards = await this.cardRepository.findBy({
       client: { id: clientId }
     });
     if (cards.length === 0) {
       throw new NotFoundException({
         message: ['Tarjetas no encontradas.'],
         error: 'Not Found',
         statusCode: 404
       });
     }
 
     return { cards };
   }
}
