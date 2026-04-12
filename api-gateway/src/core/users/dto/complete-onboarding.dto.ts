import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteOnboardingDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @ApiProperty({ example: 'string' })
  lastName: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @ApiProperty({ example: 'string' })
  password: string;

  @IsNotEmpty({ message: 'El dni es obligatorio.' })
  @MinLength(8, { message: 'El dni debe tener al menos 8 caracteres.' })
  @MaxLength(8, { message: 'El dni debe tener máximo 8 caracteres.' })
  @ApiProperty({ example: 'string' })
  identificationNumber: string;
}
