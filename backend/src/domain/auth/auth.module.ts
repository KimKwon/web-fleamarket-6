import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { MySQLModule } from 'src/config/mysql/mysql.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, MySQLModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
