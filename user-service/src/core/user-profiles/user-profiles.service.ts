import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserProfile} from "./entity/user-profiles.entity";
import {Repository} from "typeorm";
import {User} from "../users/entity/users.entity";
import {Profile} from "../profiles/entity/profiles.entity";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserProfileDto} from "./dto/create-user-profile.dto";
import {catchError, firstValueFrom, of} from "rxjs";

@Injectable()
export class UserProfilesService {

  constructor(
    @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    @Inject('POINT_SERVICE') private pointClient: ClientProxy,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const userProfileExisting = await this.userProfileRepository.findOneBy({
      user: { id: createUserProfileDto.userId },
      profile: { id: createUserProfileDto.profileId },
    });
    if (userProfileExisting) {
      throw new BadRequestException({
        message: ['Perfil en usuario ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const user = await this.userRepository.findOneBy({
      id: createUserProfileDto.userId
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const profile = await this.profileRepository.findOneBy({
      id: createUserProfileDto.profileId
    });
    if (!profile) {
      throw new NotFoundException({
        message: ['Perfil no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    if (createUserProfileDto.branchId != null) {
      const branchResponse = await firstValueFrom(
        this.adminClient.send('find_branch_by_id', { id: createUserProfileDto.branchId }).pipe(
          catchError(err => {
            if (err.statusCode === 404) {
              throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: 'Bad Request',
                statusCode: 400
              });
            }
            throw new InternalServerErrorException();
          })
        )
      );

      if (branchResponse.branch.company.id !== profile.companyId) {
        throw new BadRequestException({
          message: ['Sucursal incorrecta para el perfil seleccionado.'],
          error: 'Bad Request',
          statusCode: 400
        })
      }
    }

    const newUserProfile = this.userProfileRepository.create({
      user: user,
      profile: profile,
      ...(createUserProfileDto.branchId != null ? { branchId: createUserProfileDto.branchId } : {})
    });
    const savedUserProfile = await this.userProfileRepository.save(newUserProfile);

    return { userProfile: savedUserProfile };
  }

  async findContextOptions(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const clientResponse = await firstValueFrom(
      this.pointClient.send('find_client_by_user_id', { userId: userId }).pipe(
        catchError(() => of(null))
      )
    );

    const userProfiles = await this.userProfileRepository.find({
      where: { user: { id: userId } },
      relations: ['profile']
    });

    const response: { superadmin: boolean, client: boolean, companies: any[] } = {
      superadmin: user.isSuperAdmin,
      client: clientResponse?.client != null,
      companies: []
    };

    const empresaMap = new Map<number, { id: number, name: string, profiles: { id: number, name: string, domain: string, branchName: string }[] }>();

    for (const userProfile of userProfiles) {
      const companyResponse = await firstValueFrom(
        this.adminClient.send('find_company_by_id', { id: userProfile.profile.companyId }).pipe(
          catchError(err => {
            if (err.statusCode === 404) {
              throw new NotFoundException({
                message: ['Compañía no encontrada.'],
                error: 'Bad Request',
                statusCode: 400
              });
            }
            throw new InternalServerErrorException();
          })
        )
      );

      let branchName = "";

      if (userProfile.branchId) {
        const branchResponse = await firstValueFrom(
          this.adminClient.send('find_branch_by_id', { id: userProfile.branchId }).pipe(
            catchError(err => {
              if (err.statusCode === 404) {
                throw new NotFoundException({
                  message: ['Sucursal no encontrada.'],
                  error: 'Bad Request',
                  statusCode: 400
                });
              }
              throw new InternalServerErrorException();
            })
          )
        );

        branchName = branchResponse.branch.name;
      }

      if (!empresaMap.has(userProfile.profile.companyId)) {
        empresaMap.set(userProfile.profile.companyId, {
          id: userProfile.profile.companyId,
          name: companyResponse.company.name,
          profiles: []
        });
      }

      const empresaEntry = empresaMap.get(userProfile.profile.companyId);

      if (empresaEntry) {
        const profileEntry = empresaEntry.profiles.find(p => p.id === userProfile.profile.id);

        if (!profileEntry) {
          const newProfileEntry = {
            id: userProfile.profile.id,
            name: userProfile.profile.name,
            domain: userProfile.profile.domain,
            branchName: branchName
          };

          empresaEntry.profiles.push(newProfileEntry);
        }
      }
    }

    response.companies = Array.from(empresaMap.values());

    return response;
  }
}
