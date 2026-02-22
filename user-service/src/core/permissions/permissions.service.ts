import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Permission} from "./entity/permissions.entity";
import {Repository} from "typeorm";
import {CreatePermissionDto} from "./dto/create-permission.dto";
import {UpdatePermissionDto} from "./dto/update-permission.dto";

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

  async findAll() {
    const permissions = await this.permissionRepository.find();
    if (permissions.length === 0) {
      throw new NotFoundException({
        message: ['Permisos no encontrados.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { permissions };
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findOneBy({
      id
    });
    if (!permission) {
      throw new NotFoundException({
        message: ['Permiso no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    return { permission };
  }

  async updateById(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOneBy({
      id
    });
    if (!permission) {
      throw new NotFoundException({
        message: ['Permiso no encontrado.'],
        error: "Not Found",
        statusCode: 404
      });
    }

    await this.permissionRepository.update(id, updatePermissionDto);

    return this.findById(id);
  }
}
