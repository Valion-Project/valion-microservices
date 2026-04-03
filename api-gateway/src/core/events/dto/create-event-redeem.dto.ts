import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateEventRedeemDto {
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

  @IsNotEmpty({ message: 'El ID de la recompensa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la recompensa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  rewardId: number;
}
