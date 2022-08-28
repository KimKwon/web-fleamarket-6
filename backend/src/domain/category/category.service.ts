import { HttpException, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { MySQLService } from 'src/config/mysql/mysql.service';

@Injectable()
export class CategoryService {
  pool: Pool;
  constructor(private readonly mysqlService: MySQLService) {
    this.pool = this.mysqlService.pool;
  }
  async getCategories() {
    try {
      const [categories] = await this.pool.query(/*sql*/ `
        SELECT * FROM CATEGORY;
      `);

      return categories;
    } catch (e) {
      throw new HttpException('Failed to GET Category info', 500);
    }
  }
}
