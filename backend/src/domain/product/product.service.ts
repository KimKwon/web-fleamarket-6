import { HttpException, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';
import { MySQLService } from 'src/config/mysql/mysql.service';
import { S3Service } from 'src/config/s3/s3.service';
import {
  ProductLikeRequestBody,
  ProductParam,
  ProductsGetOptions,
  CreateProductDTO,
  ModifyProductDTO,
} from './types/product';
import formatData from 'src/utils/format';

@Injectable()
export class ProductService {
  pool: Pool;
  constructor(
    private readonly awsS3Service: S3Service,
    private readonly mysqlService: MySQLService,
  ) {
    this.pool = mysqlService.pool;
  }

  private async isProductExist(productId: number) {
    const [result] = await this.pool.query(/*sql*/ `
      SELECT 1 FROM PRODUCT WHERE PRODUCT.id = ${productId} AND PRODUCT.deletedAt IS NULL LIMIT 1;
    `);

    return Boolean(result[0]);
  }

  async getProductById(productId: number) {
    const isExist = await this.isProductExist(productId);
    if (!isExist) {
      throw new HttpException(`Cannot found Product.`, 404);
    }

    const [result] = await this.pool.query(/*sql*/ `
      SELECT P.*, UR.nickname as authorName, COUNT(ULP.id) as likeCount, C.name as categoryName, regionName
      FROM PRODUCT as P
      INNER JOIN CATEGORY as C ON C.id = P.categoryId
      INNER JOIN (SELECT U.nickname, U.id, R.name as regionName FROM USER as U INNER JOIN REGION as R) AS UR ON P.authorId = UR.id
      LEFT JOIN USER_LIKE_PRODUCT as ULP ON ULP.productId = P.id
      where P.id = ${productId};
    `);

    return result[0];
  }

  async getProducts(options: ProductsGetOptions) {
    const { userId, filter, categoryId, page = 1 } = options;

    const LIMIT = 10;
    const REGION_SUBQUERY = `(SELECT name from USER JOIN REGION ON USER.regionId = REGION.id where USER.id = authorId) as regionName`;
    const ISLIKED_SUBQUERY = `EXISTS (SELECT * FROM USER_LIKE_PRODUCT where userId = ${
      userId ?? -1
    } and productId = P.id) as isLiked`;
    const LIKECOUNT_SUBQUERY = `(SELECT COUNT(1) FROM USER_LIKE_PRODUCT as ULP WHERE ULP.productId = P.id) as likeCount`;
    const ISLIKED_TRUE = `(SELECT 1) AS isLiked`;
    const CHECK_IS_DELETED = `P.deletedAt IS NULL`;

    const SELECT_WITH = `DISTINCT ${REGION_SUBQUERY}, ${LIKECOUNT_SUBQUERY},`;
    const BASE_TABLE = /*sql*/ `PRODUCT as P LEFT JOIN USER_LIKE_PRODUCT as ULP ON ULP.productId = P.id`;

    if (filter && categoryId) {
      throw new HttpException(
        'Filter cannot be provided with category option. Choose one.',
        400,
      );
    }

    if (!userId && filter) {
      throw new HttpException('filter should be provided with userId.', 400);
    }

    let beforePaginationQuery = /*sql*/ `SELECT ${SELECT_WITH} ${ISLIKED_SUBQUERY}, P.* FROM ${BASE_TABLE} WHERE ${CHECK_IS_DELETED}`;

    if (filter === 'like') {
      beforePaginationQuery = /*sql*/ `
        SELECT ${SELECT_WITH} P.*, ${ISLIKED_TRUE} FROM ${BASE_TABLE} WHERE ULP.userId = ${userId} AND ${CHECK_IS_DELETED}
      `;
    }

    if (filter === 'sale') {
      beforePaginationQuery = /*sql*/ `
        SELECT ${SELECT_WITH} ${ISLIKED_SUBQUERY}, P.* FROM ${BASE_TABLE} WHERE P.authorId = ${userId} AND ${CHECK_IS_DELETED}
      `;
    }

    if (categoryId) {
      beforePaginationQuery = /*sql*/ `
        SELECT ${SELECT_WITH} ${ISLIKED_SUBQUERY}, P.* FROM ${BASE_TABLE} WHERE P.categoryId = ${categoryId} AND ${CHECK_IS_DELETED}
      `;
    }

    const paginatedQuery = /*sql*/ `${beforePaginationQuery} ORDER BY createdAt DESC LIMIT ${
      (page - 1) * LIMIT
    }, ${LIMIT}`;

    const [result] = await this.pool.query(paginatedQuery);
    const [totalData] = (await this.pool.query(beforePaginationQuery)) as any[];

    return {
      totalCount: totalData?.length || 0,
      data: result,
    };
  }

  async likeOrDislikeProduct(options: ProductLikeRequestBody & ProductParam) {
    const { userId, productId, isLiked: targetIsLiked } = options;

    if (!targetIsLiked) {
      await this.pool.query(/*sql*/ `
        DELETE FROM USER_LIKE_PRODUCT WHERE userId = ${userId} and productId = ${productId};
      `);
    } else {
      await this.pool.query(/*sql*/ `
        INSERT INTO USER_LIKE_PRODUCT (userId, productId)
        SELECT ${userId}, ${productId} FROM dual WHERE NOT EXISTS
        (SELECT 1 FROM USER_LIKE_PRODUCT WHERE userId = ${userId} and productId = ${productId});
      `);
    }

    return {
      isLiked: targetIsLiked,
    };
  }

  async uploadThumbnails(thumbnails: Array<Express.Multer.File>) {
    try {
      const uploadPromise = thumbnails.map((thumbnail) =>
        this.awsS3Service.uploadFile(thumbnail),
      );

      const thumbnailUrls = await Promise.all(uploadPromise);
      return thumbnailUrls;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to upload Image.', 500);
    }
  }

  async writePost(post: CreateProductDTO) {
    try {
      const postData = {
        ...post,
        createdAt: new Date().toISOString(),
        isSold: 0,
        viewCount: 0,
      };

      const [res] = await this.mysqlService.pool.execute(`
        INSERT INTO PRODUCT (${Object.keys(postData).join()})
        VALUES (${Object.values(postData).map(formatData).join()})
        `);

      const { insertId } = res as ResultSetHeader;
      return {
        productId: insertId,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to upload Post.', 500);
    }
  }

  async modifyPostById(productId: number, post: Partial<ModifyProductDTO>) {
    const isExist = await this.isProductExist(productId);
    if (!isExist) {
      throw new HttpException(`Cannot found Product.`, 404);
    }

    const modifyTemplate = Object.entries(post)
      .map(([key, val]) => `${key}= ${formatData(val)}`)
      .join(', ');

    const [res] = await this.pool.query(/*sql*/ `
      UPDATE PRODUCT SET ${modifyTemplate} WHERE id = ${productId};
    `);

    const modifedResult = res as ResultSetHeader;
    if (!modifedResult?.changedRows) {
      throw new HttpException('Nothing changed.', 422);
    }

    return post;
  }

  async deletePostById(productId: number) {
    const deletedAt = new Date().toISOString();

    const [result] = await this.pool.query(/* sql */ `
      UPDATE PRODUCT SET deletedAt =  "${deletedAt}" WHERE id = ${productId};
    `);

    const modifedResult = result as ResultSetHeader;
    if (!modifedResult?.changedRows) {
      throw new HttpException('Something wrong when delete Product', 422);
    }

    return {
      productId,
      deletedAt,
    };
  }
}
