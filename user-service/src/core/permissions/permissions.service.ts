import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Permission} from "./entity/permissions.entity";
import {Repository} from "typeorm";
import {CreatePermissionDto} from "./dto/create-permission.dto";

@Injectable()
export class PermissionsService {

  constructor(
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permissionExisting = await this.permissionRepository.findOneBy({
      name: createPermissionDto.name
    });
    if (permissionExisting) {
      throw new BadRequestException({
        message: ['Permiso ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newPermission = this.permissionRepository.create({
      name: createPermissionDto.name,
      description: createPermissionDto.description,
      domain: createPermissionDto.domain
    });
    const savedPermission = await this.permissionRepository.save(newPermission);

    return { permission: savedPermission };
  }
}
