import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generate as shortid } from 'shortid';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3: AWS.S3;
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });

    this.s3 = new AWS.S3({
      signatureVersion: 'v4',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const Key = `${Date.now()}_${shortid()}`;
      await this.s3
        .putObject({
          Key,
          Body: file.buffer,
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          ContentType: file.mimetype,
        })
        .promise();

      return this.configService.get('S3_ADDRESS') + Key;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to upload image to S3', 500);
    }
  }
}
