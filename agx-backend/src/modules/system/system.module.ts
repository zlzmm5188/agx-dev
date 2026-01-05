import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemToggle, LevelPermission, Config } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemToggle, LevelPermission, Config])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
