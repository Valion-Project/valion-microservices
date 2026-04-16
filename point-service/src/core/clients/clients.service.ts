import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Client} from "./entity/clients.entity";
import {Repository} from "typeorm";
import {CreateClientDto} from "./dto/create-client.dto";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";
import {Card} from "../cards/entity/cards.entity";
import * as QRCode from 'qrcode';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const clientExisting = await this.clientRepository.findOne({
      where: [{
        identificationNumber: createClientDto.identificationNumber,
      }, {
        userId: createClientDto.userId,
      }]
    });
    if (clientExisting) {
      throw new BadRequestException({
        message: ['Cliente ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const userResponse = await firstValueFrom(
      this.userClient.send('find_user_by_id', { id: createClientDto.userId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Usuario no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const newClient = this.clientRepository.create({
      identificationNumber: createClientDto.identificationNumber,
      userId: createClientDto.userId,
      isInternal: createClientDto.isInternal,
    });
    const savedClient = await this.clientRepository.save(newClient);

    return {
      client: {
        ...savedClient,
        user: userResponse.user,
      }
    }
  }

  async findByUserId(userId: number) {
    const client = await this.clientRepository.findOneBy({
      userId
    });
    if (!client) {
      throw new NotFoundException({
        message: ['Cliente no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { client };
  }

  async findQrById(id: number) {
    const client = await this.clientRepository.findOneBy({
      id
    });
    if (!client) {
      throw new NotFoundException({
        message: ['Cliente no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const url = `${process.env.FRONT_DOMAIN}/home/OPERATOR/info-client/${client.id}`;
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return { qrCode };
  }

  async findByIdentificationNumber(identificationNumber: string) {
    const client = await this.clientRepository.findOneBy({
      identificationNumber
    });
    if (!client) {
      throw new NotFoundException({
        message: ['Cliente no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { client };
  }

  async findByIdentificationNumberAndCompanyId(identificationNumber: string, companyId: number) {
    const client = await this.clientRepository.findOneBy({
      identificationNumber
    });
    if (!client) {
      throw new NotFoundException({
        message: ['Cliente no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await firstValueFrom(
      this.adminClient.send('find_company_by_id', { id: companyId }).pipe(
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

    const cards = await this.cardRepository.find({
      where: { companyId, client: { id: client.id } }
    });
    if (cards.length === 0) {
      throw new NotFoundException({
        message: ['Cliente no cuenta con tarjetas en la empresa.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { client };
  }
}
