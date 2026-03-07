import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProfilePermission} from "./entity/profile-permissions.entity";
import {DataSource, Repository} from "typeorm";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";
import {Profile, ProfileDomain} from "../profiles/entity/profiles.entity";
import {Permission, PermissionDomain} from "../permissions/entity/permissions.entity";
import {UpdateProfilePermissionDto} from "./dto/update-profile-permission.dto";

@Injectable()
export class ProfilePermissionsService {

  constructor(
    @InjectRepository(ProfilePermission) private profilePermissionRepository: Repository<ProfilePermission>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    private dataSource: DataSource,
  ) {}

  async create(createProfilePermissionDto: CreateProfilePermissionDto) {
    const profilePermissionExisting = await this.profilePermissionRepository.findOneBy({
      profile: { id: createProfilePermissionDto.profileId },
      permission: { id: createProfilePermissionDto.permissionId }
    });
    if (profilePermissionExisting) {
      throw new BadRequestException({
        message: ['Permiso en pergfil ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const profile = await this.profileRepository.findOneBy({
      id: createProfilePermissionDto.profileId
    });
    if (!profile) {
      throw new BadRequestException({
        message: ['Perfil no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const permission = await this.permissionRepository.findOneBy({
      id: createProfilePermissionDto.permissionId
    });
    if (!permission) {
      throw new BadRequestException({
        message: ['Permiso no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (profile.domain === ProfileDomain.OPERATOR) {
      if (permission.domain === PermissionDomain.ADMIN || permission.domain === PermissionDomain.BRANCH) {
        throw new BadRequestException({
          message: ['No se pueden agregar permisos ADMIN o BRANCH a un perfil de dominio OPERATOR.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    } else if (profile.domain === ProfileDomain.ADMIN) {
      if (permission.domain === PermissionDomain.OPERATOR) {
        throw new BadRequestException({
          message: ['No se pueden agregar permisos OPERATOR a un perfil de dominio ADMIN.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    }

    const savedProfilePermission = await this.dataSource.transaction(async manager => {
      const profileRepository = manager.getRepository(Profile);
      const profilePermissionRepository = manager.getRepository(ProfilePermission);

      if (profile.domain === null) {
        const domain = permission.domain === PermissionDomain.OPERATOR ? ProfileDomain.OPERATOR : ProfileDomain.ADMIN;
        await profileRepository.update(profile.id, { domain: domain });
      }

      const newProfilePermission = profilePermissionRepository.create({
        isAvailable: createProfilePermissionDto.isAvailable,
        profile: profile,
        permission: permission
      });
      const savedProfilePermission = await profilePermissionRepository.save(newProfilePermission);

      return { profilePermission: savedProfilePermission };
    });

    return { profilePermission: savedProfilePermission.profilePermission };
  }

  async findProfilePermissionAvailabilityInPermissions(profileId: number) {
    const permissions = await this.permissionRepository.find();
    const profile = await this.profileRepository.findOneBy({
      id: profileId
    });

    const profilePermissions: ProfilePermission[] = [];

    for (const permission of permissions) {
      const profilePermission = await this.profilePermissionRepository.findOne({
        where: { permission: { id: permission.id }, profile: { id: profileId } },
        relations: ['profile', 'permission']
      });
      if (profilePermission) {
        profilePermissions.push(profilePermission);
      } else {
        const profilePermission = {
          profile: profile,
          permission: permission
        } as ProfilePermission;
        profilePermissions.push(profilePermission);
      }
    }

    return { profilePermissions };
  }

  async findById(id: number) {
    const profilePermission = await this.profilePermissionRepository.findOne({
      where: { id },
      relations: ['profile', 'permission'],
    });
    if (!profilePermission) {
      throw new NotFoundException({
        message: ['Permiso en perfil no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { profilePermission };
  }

  async updateById(id: number, updateProfilePermissionDto: UpdateProfilePermissionDto) {
    const profilePermission = await this.profilePermissionRepository.findOneBy({
      id
    });
    if (!profilePermission) {
      throw new NotFoundException({
        message: ['Permiso en perfil no encontrado.'],
        error: "Not Found",
        statusCode: 404
      })
    }

    await this.profilePermissionRepository.update(id, updateProfilePermissionDto);

    return this.findById(id);
  }
}
