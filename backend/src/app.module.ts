import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MySQLModule } from './config/mysql/mysql.module';
import { AuthModule } from './domain/auth/auth.module';
import { ProductModule } from './domain/product/product.module';
import { S3Module } from './config/s3/s3.module';
import { CategoryModule } from './domain/category/category.module';
import { RegionModule } from './domain/region/region.module';
import { ChatModule } from './domain/chat/chat.module';

const isDevelopment = process.env.NODE_ENV === 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopment ? '.env.development' : '.env.production',
    }),
    MySQLModule,
    AuthModule,
    ProductModule,
    S3Module,
    CategoryModule,
    RegionModule,
    ChatModule,
  ],
})
export class AppModule {}
