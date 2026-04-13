import {IsNotEmpty, IsNumber, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateCardFromOnboardingDto {
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

  @IsNotEmpty({ message: 'El ID del perfil del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userProfileId: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(0, { message: 'La cantidad no puede ser negativo.' })
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  branchId: number;
}
