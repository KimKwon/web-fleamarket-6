import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MySQLService } from './mysql.service';

@Module({
  imports: [ConfigModule],
  providers: [MySQLService],
  exports: [MySQLService],
})
export class MySQLModule {}
