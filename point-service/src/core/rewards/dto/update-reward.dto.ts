import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class UpdateRewardDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El costo de puntos es obligatorio.' })
  @IsNumber({}, { message: 'El costo de puntos debe ser un número.' })
  @Min(0, { message: 'El costo de puntos no puede ser negativo.' })
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  pointCost: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El costo de visitas es obligatorio.' })
  @IsNumber({}, { message: 'El costo de visitas debe ser un número.' })
  @Min(0, { message: 'El costo de visitas no puede ser negativo.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  visitCost: number;
}
