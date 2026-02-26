import {IsBoolean, IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @ApiProperty({ example: 'string' })
  password: string;

  @IsNotEmpty({ message: 'El campo de tokens es obligatorio.' })
  @IsBoolean({ message: 'El campo de tokens debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  invalidateTokens: boolean;
}
