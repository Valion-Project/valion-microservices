import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateProfilePermissionDto {
  @IsNotEmpty({ message: 'El ID del perfil es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  profileId: number;

  @IsNotEmpty({ message: 'El ID del permiso es obligatorio.' })
  @IsNumber({}, { message: 'El ID del permiso debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  permissionId: number;
}
