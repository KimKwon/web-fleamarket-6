import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MySQLModule } from 'src/config/mysql/mysql.module';

@Module({
  imports: [MySQLModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
