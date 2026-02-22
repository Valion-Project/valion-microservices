import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {PermissionsService} from "./permissions.service";
import {CreatePermissionDto} from "./dto/create-permission.dto";
import {UpdatePermissionDto} from "./dto/update-permission.dto";

@Controller('permissions')
export class PermissionsController {

  constructor(private permissionsService: PermissionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  getAll() {
    return this.permissionsService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.updateById(id, updatePermissionDto);
  }
}
