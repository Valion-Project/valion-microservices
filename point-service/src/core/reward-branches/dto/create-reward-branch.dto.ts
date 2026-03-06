import {IsBoolean, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateRewardBranchDto {
  @IsNotEmpty({ message: 'El campo de disponibilidad es obligatorio.' })
  @IsBoolean({ message: 'El campo de disponibilidad debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isAvailable: boolean;

  @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsNotEmpty({ message: 'El ID de la recompensa es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la recompensa debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  rewardId: number;
}
