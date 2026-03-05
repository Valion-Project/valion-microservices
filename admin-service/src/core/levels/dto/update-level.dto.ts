import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class UpdateLevelDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El multiplicador es obligatorio.' })
  @IsNumber({}, { message: 'El multiplicador debe ser un número.' })
  @Min(0, { message: 'El multiplicador no puede ser negativo.' })
  @ApiProperty({ example: 1.1 })
  @Type(() => Number)
  multiplier: number;
}
