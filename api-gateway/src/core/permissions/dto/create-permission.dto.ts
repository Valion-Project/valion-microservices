import {IsEnum, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {PermissionDomain} from "../entity/permissions.entity";

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @IsEnum(PermissionDomain, { message: 'El dominio es incorrecto.' })
  @ApiProperty({ enum: PermissionDomain, example: PermissionDomain.ADMIN })
  domain: PermissionDomain;
}
