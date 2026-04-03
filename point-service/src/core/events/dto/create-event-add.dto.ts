import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateEventAddDto {
  @IsNotEmpty({ message: 'El ID de la tarjeta es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la tarjeta debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  cardId: number;

  @IsNotEmpty({ message: 'El ID del perfil del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userProfileId: number;

  @IsOptional()
  @IsNotEmpty({ message: 'La cantidad de puntos es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad de puntos debe ser un número.' })
  @Min(0, { message: 'La cantidad de puntos no puede ser negativo.' })
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  points: number;

  @IsOptional()
  @IsNotEmpty({ message: 'La cantidad de visitas es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad de visitas debe ser un número.' })
  @Min(0, { message: 'La cantidad de visitas no puede ser negativo.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  visits: number;
}
