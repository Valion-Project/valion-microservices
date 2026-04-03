import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Client} from "./entity/clients.entity";
import {Repository} from "typeorm";
import {CreateClientDto} from "./dto/create-client.dto";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
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
}
