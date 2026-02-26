import {IsEmail, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindVerificationCodeDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;

  @IsNotEmpty({ message: 'El código es obligatorio.' })
  @ApiProperty({ example: 'string' })
  code: string;
}
