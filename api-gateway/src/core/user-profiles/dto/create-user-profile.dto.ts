import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateUserProfileDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNotEmpty({ message: 'El ID del perfil es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  profileId: number;
}
