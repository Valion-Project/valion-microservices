import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { LevelsDevController } from './levels-dev.controller';

@Module({
  controllers: [LevelsController, LevelsDevController],
  providers: [LevelsService]
})
export class LevelsModule {}
