import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Profile, ProfileDomain} from "./entity/profiles.entity";
import {DataSource, Repository} from "typeorm";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";
import {ProfilePermission} from "../profile-permissions/entity/profile-permissions.entity";
import {User} from "../users/entity/users.entity";
import {UserProfile} from "../user-profiles/entity/user-profiles.entity";
import * as bcrypt from 'bcrypt';
import {CreateOnboardingProfileDto} from "./dto/create-onboarding-profile.dto";
import {Permission, PermissionDomain} from "../permissions/entity/permissions.entity";
import {UpdateProfileDto} from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    private dataSource: DataSource,
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
              message: ['Empresa no encontrada.'],
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

  async createOnboardingProfile(companyId: number, createOnboardingProfileDto: CreateOnboardingProfileDto) {
    const hashedPassword = await bcrypt.hash(createOnboardingProfileDto.password, 10);

    const userExisting = await this.userRepository.findOneBy({
      email: createOnboardingProfileDto.email
    });

    const adminPermissions = await this.permissionRepository.find({
      where: { domain: PermissionDomain.ADMIN }
    });
    if (adminPermissions.length === 0) {
      throw new NotFoundException({
        message: ['Permisos de administrador no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    const savedProfileOnboarding = await this.dataSource.transaction(async manager => {
      const userRepository = manager.getRepository(User);
      const profileRepository = manager.getRepository(Profile);
      const userProfileRepository = manager.getRepository(UserProfile);
      const profilePermissionRepository = manager.getRepository(ProfilePermission);

      const newProfile = profileRepository.create({
        name: "Administrador Total",
        companyId: companyId,
        domain: ProfileDomain.ADMIN
      });
      const savedProfile = await profileRepository.save(newProfile);

      if (userExisting) {
        const newUserProfile = userProfileRepository.create({
          user: userExisting,
          profile: savedProfile
        });
        await userProfileRepository.save(newUserProfile);
      } else {
        const newUser = userRepository.create({
          name: createOnboardingProfileDto.name,
          lastName: createOnboardingProfileDto.lastName,
          email: createOnboardingProfileDto.email,
          password: hashedPassword,
          tokenVersion: 1,
          isSuperAdmin: false
        });
        const savedUser = await userRepository.save(newUser);

        const newUserProfile = userProfileRepository.create({
          user: savedUser,
          profile: savedProfile
        });
        await userProfileRepository.save(newUserProfile);
      }

      for (const adminPermission of adminPermissions) {
        const newProfilePermission = profilePermissionRepository.create({
          profile: savedProfile,
          permission: adminPermission,
          isAvailable: true
        });
        await profilePermissionRepository.save(newProfilePermission);
      }

      return { profile: savedProfile };
    });

    return { profile: savedProfileOnboarding.profile };
  }

  async findByCompanyId(companyId: number) {
    const profiles = await this.profileRepository.find({
      where: { companyId: companyId },
      relations: ['profilePermissions', 'profilePermissions.permission']
    });
    if (profiles.length === 0) {
      throw new NotFoundException({
        message: ['Perfiles no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { profiles: profiles };
  }

  async findById(id: number) {
    const profile = await this.profileRepository.findOneBy({
      id
    });
    if (!profile) {
      throw new NotFoundException({
        message: ['Perfil no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { profile: profile };
  }

  async updateById(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOneBy({
      id
    });
    if (!profile) {
      throw new NotFoundException({
        message: ['Perfil no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    const profileExisting = await this.profileRepository.findOneBy({
      name: updateProfileDto.name,
      companyId: profile.companyId
    });
    if (profileExisting && profileExisting.id !== id) {
      throw new BadRequestException({
        message: ['Perfil ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    await this.profileRepository.update(id, updateProfileDto);

    return this.findById(id);
  }
}
