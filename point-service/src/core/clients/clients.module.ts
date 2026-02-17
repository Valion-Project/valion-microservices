import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsDevController } from './clients-dev.controller';

@Module({
  controllers: [ClientsController, ClientsDevController],
  providers: [ClientsService]
})
export class ClientsModule {}
