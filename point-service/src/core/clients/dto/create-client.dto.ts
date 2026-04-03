import {IsBoolean, IsNotEmpty, IsNumber, MaxLength, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateClientDto {
  @IsNotEmpty({ message: 'El dni es obligatorio.' })
  @MinLength(8, { message: 'El dni debe tener al menos 8 caracteres.' })
  @MaxLength(8, { message: 'El dni debe tener máximo 8 caracteres.' })
  @ApiProperty({ example: 'string' })
  identificationNumber: string;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNotEmpty({ message: 'El campo interno es obligatorio.' })
  @IsBoolean({ message: 'El campo interno debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isInternal: boolean;
}
