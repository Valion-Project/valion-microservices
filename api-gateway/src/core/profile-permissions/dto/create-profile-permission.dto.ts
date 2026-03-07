import {IsBoolean, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateProfilePermissionDto {
  @IsNotEmpty({ message: 'El campo de disponibilidad es obligatorio.' })
  @IsBoolean({ message: 'El campo de disponibilidad debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isAvailable: boolean;

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
