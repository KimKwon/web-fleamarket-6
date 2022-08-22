import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { S3Service } from 'src/config/s3/s3.service';
import { MySQLModule } from 'src/config/mysql/mysql.module';

@Module({
  imports: [MySQLModule],
  controllers: [ProductController],
  providers: [ProductService, S3Service],
})
export class ProductModule {}
