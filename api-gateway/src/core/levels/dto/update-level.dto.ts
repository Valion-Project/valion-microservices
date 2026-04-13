import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
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

  @IsOptional()
  @IsNotEmpty({ message: 'El campo "nivel por defecto" es obligatorio.' })
  @IsBoolean({ message: 'El campo "nivel por defecto" debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: false })
  isDefault: boolean;

  @IsOptional()
  @IsNotEmpty({ message: 'El ID del nuevo nivel por defecto es obligatorio.' })
  @IsNumber({}, { message: 'El ID del nuevo nivel por defecto debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  newDefaultLevelId: number;
}
