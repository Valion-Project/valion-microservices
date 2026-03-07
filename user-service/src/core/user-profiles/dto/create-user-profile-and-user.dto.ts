import {IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";
import {CreatePlainUserDto} from "./create-plain-user.dto";

export class CreateUserProfileAndUserDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio.' })
  @ValidateNested({ each: true, message: 'El usuario debe ser válido.' })
  @Type(() => CreatePlainUserDto)
  @ApiProperty({ type: () => CreatePlainUserDto })
  user: CreatePlainUserDto;

  @IsNotEmpty({ message: 'El ID del perfil es obligatorio.' })
  @IsNumber({}, { message: 'El ID del perfil debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  profileId: number;
}
