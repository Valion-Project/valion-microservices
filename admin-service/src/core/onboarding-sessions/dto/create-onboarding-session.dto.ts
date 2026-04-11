import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateOnboardingSessionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(0, { message: 'La cantidad no puede ser negativo.' })
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty({ message: 'El ID del perfil del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userProfileId: number;

  @IsNotEmpty({ message: 'El ID del programa de fidelidad es obligatorio.' })
  @IsNumber({}, { message: 'El ID del programa de fidelidad debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyProgramId: number;
}
