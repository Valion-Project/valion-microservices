import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProfilePermission} from "./entity/profile-permissions.entity";
import {Repository} from "typeorm";
import {CreateProfilePermissionDto} from "./dto/create-profile-permission.dto";
import {Profile} from "../profiles/entity/profiles.entity";
import {Permission} from "../permissions/entity/permissions.entity";

@Injectable()
export class ProfilePermissionsService {

  constructor(
    @InjectRepository(ProfilePermission) private profilePermissionRepository: Repository<ProfilePermission>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
  ) {}

  async create(createProfilePermissionDto: CreateProfilePermissionDto) {
    const profilePermissionExisting = await this.profilePermissionRepository.findOneBy({
      profile: { id: createProfilePermissionDto.profileId },
      permission: { id: createProfilePermissionDto.permissionId }
    });
    if (profilePermissionExisting) {
      throw new BadRequestException({
        message: ['Permiso en perfil ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const profile = await this.profileRepository.findOneBy({
      id: createProfilePermissionDto.profileId
    });
    if (!profile) {
      throw new NotFoundException({
        message: ['Perfil no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const permission = await this.permissionRepository.findOneBy({
      id: createProfilePermissionDto.permissionId
    });
    if (!permission) {
      throw new NotFoundException({
        message: ['Permiso no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const newProfilePermission = this.profilePermissionRepository.create({
      profile: profile,
      permission: permission
    });
    const savedProfilePermission = await this.profilePermissionRepository.save(newProfilePermission);

    return { profilePermission: savedProfilePermission };
  }
}
