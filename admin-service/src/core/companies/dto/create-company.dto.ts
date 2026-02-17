import {IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;
}
