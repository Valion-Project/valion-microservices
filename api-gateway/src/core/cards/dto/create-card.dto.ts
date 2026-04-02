import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateCardDto {
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyId: number;

  @IsNotEmpty({ message: 'El ID del nivel es obligatorio.' })
  @IsNumber({}, { message: 'El ID del nivel debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  levelId: number;

  @IsNotEmpty({ message: 'El ID del programa de fidelidad en la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID del programa de fidelidad en la empresa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyProgramId: number;
}
