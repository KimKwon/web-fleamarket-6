import { HttpException, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { MySQLService } from 'src/config/mysql/mysql.service';
import { ChangedUserInfo } from './types/region';

@Injectable()
export class RegionService {
  pool: Pool;
  constructor(private readonly mysqlService: MySQLService) {
    this.pool = this.mysqlService.pool;
  }

  async getRegions() {
    try {
      const [regions] = await this.pool.query(`
        SELECT * FROM REGION;
      `);

      return regions;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to GET REGION info', 500);
    }
  }

  async changeUserRegion({ userId, regionId }: ChangedUserInfo) {
    try {
      const [res] = await this.pool.query(`
      UPDATE USER SET regionId = ${regionId} WHERE id = ${userId};
      `);

      return res;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to UPDATE USER info', 500);
    }
  }
}
