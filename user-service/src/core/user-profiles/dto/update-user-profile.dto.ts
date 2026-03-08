import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class UpdateUserProfileDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  branchId: number;
}
