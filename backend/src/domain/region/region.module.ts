import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/config/mysql/mysql.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  imports: [MySQLModule],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
