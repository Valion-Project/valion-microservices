import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateCompanyProgramDto {
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyId: number;

  @IsNotEmpty({ message: 'El ID del programa de fidelidad es obligatorio.' })
  @IsNumber({}, { message: 'El ID del programa de fidelidad debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  loyaltyProgramId: number;
}
