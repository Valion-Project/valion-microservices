import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {

  @Get('version')
  getVersion() {
    return {
      version: '0.0.0'
    };
  }
}
