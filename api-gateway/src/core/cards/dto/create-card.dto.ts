import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateCardDto {
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio.' })
  @IsNumber({}, { message: 'El ID del cliente debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  clientId: number;

  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyId: number;

  @IsNotEmpty({ message: 'El ID del programa de fidelidad en la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID del programa de fidelidad en la empresa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyProgramId: number;
}
