import {IsBoolean, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class UpdateRewardBranchDto {
  @IsNotEmpty({ message: 'El campo de disponibilidad es obligatorio.' })
  @IsBoolean({ message: 'El campo de disponibilidad debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isAvailable: boolean;
}
