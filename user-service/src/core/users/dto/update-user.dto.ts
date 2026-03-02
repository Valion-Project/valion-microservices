import {IsNotEmpty, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @ApiProperty({ example: 'string' })
  lastName: string;
}
