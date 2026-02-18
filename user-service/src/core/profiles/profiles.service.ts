import {BadRequestException, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Profile} from "./entity/profiles.entity";
import {Repository} from "typeorm";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const profileExisting = await this.profileRepository.findOneBy({
      name: createProfileDto.name,
      companyId: createProfileDto.companyId
    });
    if (profileExisting) {
      throw new BadRequestException({
        message: ['Perfil ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const companyResponse = await firstValueFrom(
      this.adminClient.send('find_company_by_id', { id: createProfileDto.companyId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Compañía no encontrada.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const newProfile = this.profileRepository.create({
      name: createProfileDto.name,
      companyId: createProfileDto.companyId
    });
    const savedProfile = await this.profileRepository.save(newProfile);

    return {
      profile: {
        ...savedProfile,
        company: companyResponse.company
      }
    };
  }
}
