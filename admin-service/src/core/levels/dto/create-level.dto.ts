import {IsNotEmpty, IsNumber, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateLevelDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'El multiplicador es obligatorio.' })
  @IsNumber({}, { message: 'El multiplicador debe ser un número.' })
  @Min(0, { message: 'El multiplicador no puede ser negativo.' })
  @ApiProperty({ example: 1.1 })
  @Type(() => Number)
  multiplier: number;

  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  companyId: number;
}
