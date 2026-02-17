import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {PermissionsService} from "./permissions.service";
import {CreatePermissionDto} from "./dto/create-permission.dto";

@Controller('permissions-dev')
export class PermissionsDevController {

  constructor(private permissionsService: PermissionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }
}
