import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MySQLService } from 'src/config/mysql/mysql.service';
import { Pool, ResultSetHeader } from 'mysql2/promise';
import formatData from 'src/utils/format';
import * as jwt from 'jsonwebtoken';
import { SigninInfo, SignupInfo, UserInfo } from './type/auth';
import { JWT_ERROR_MAP } from 'src/constants/auth';

@Injectable()
export class AuthService {
  pool: Pool;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private mysqlService: MySQLService,
  ) {
    this.pool = this.mysqlService.pool;
  }

  async getUserInfoFromGithub(accessToken: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        },
      );

      return data;
    } catch (e) {
      throw new HttpException(
        `Can't load User information. Maybe Access Token is Wrong`,
        401,
      );
    }
  }

  async getAccessToken(code: string) {
    const client_id = this.configService.get('CLIENT_ID');
    const client_secret = this.configService.get('CLIENT_SECRET');

    if (!client_id || !client_secret || !code)
      throw new HttpException(`Required Data is not Provided.`, 400);

    try {
      const { data } = await this.httpService.axiosRef.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id,
          client_secret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      return data.access_token;
    } catch (e) {
      throw new HttpException(`Failed to Fetch Token from provider.`, 500);
    }
  }

  async findOAuthUser(githubUserId: string) {
    try {
      const [result] = await this.pool.execute(
        `SELECT U.id, U.nickname, U.regionId, R.name as regionName FROM USER as U 
        INNER JOIN REGION as R ON R.id = U.regionId
        WHERE U.githubUserId = ${githubUserId}`,
      );

      return result[0];
    } catch (e) {
      throw new HttpException(
        `Failed Execute SQL Syntax Or Internal Server Error`,
        500,
      );
    }
  }

  async findUserById(id: number) {
    try {
      const [result] = await this.pool.execute(
        `SELECT U.id, U.nickname, U.regionId, R.name as regionName FROM USER as U 
        INNER JOIN REGION as R ON R.id = U.regionId
        WHERE U.id = ${id}`,
      );

      return result[0];
    } catch (e) {
      throw new HttpException(
        `Failed Execute SQL Syntax Or Internal Server Error`,
        500,
      );
    }
  }

  async signup(user: SignupInfo) {
    const [res] = await this.pool.execute(
      `INSERT INTO USER (${Object.keys(user).join()})
          SELECT ${Object.values(user)
            .map(formatData)
            .join()} FROM dual WHERE NOT EXISTS (SELECT 1 from USER WHERE nickname=${formatData(
        user.nickname,
      )})`,
    );

    const result = res as ResultSetHeader;

    if (!result.insertId) {
      throw new HttpException('이미 존재하는 닉네임입니다.', 409);
    }

    return result.insertId;
  }

  async signin(user: SigninInfo) {
    const [res] = await this.pool.execute(`
      SELECT U.id, U.nickname, U.regionId, R.name as regionName FROM USER as U 
      INNER JOIN REGION as R ON R.id = U.regionId
      WHERE nickname = ${formatData(user.nickname)} AND password = ${formatData(
      user.password,
    )}
    `);

    if (!res[0]) {
      throw new HttpException('로그인에 실패하였습니다.', 401);
    }

    return res[0];
  }

  async getUserInfo(token: string) {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          this.configService.get('JWT_SECRET_KEY'),
          (error, decoded) => {
            if (error) {
              if (error.message in JWT_ERROR_MAP)
                JWT_ERROR_MAP[error.message]();
              else reject(error.message);
            }

            resolve(decoded);
          },
        );
      });

      return decoded;
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException(e.message, 401);
      }

      throw new HttpException(e, 401);
    }
  }

  generateToken(userInfo: UserInfo) {
    const token = jwt.sign(
      { ...userInfo },
      this.configService.get('JWT_SECRET_KEY'),
      {
        expiresIn: '7d',
      },
    );

    return token;
  }
}
