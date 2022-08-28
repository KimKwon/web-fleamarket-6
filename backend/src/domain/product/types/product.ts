import { OmitType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsJSON,
} from 'class-validator';

export type ProductFilterType = 'sale' | 'like';
export type ProductLocationType = 'home' | 'my';

export class ProductsGetOptions {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  filter?: ProductFilterType;

  @IsString()
  @IsOptional()
  location?: ProductLocationType;
}

export class ProductParam {
  @IsNumber()
  productId: number;
}

export class ProductLikeRequestBody {
  @IsBoolean()
  isLiked: boolean;

  @IsNumber()
  userId: number;
}

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsJSON()
  thumbnails: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  authorId: number;
}

export class ModifyProductDTO extends OmitType(CreateProductDTO, ['authorId']) {
  isSold: boolean;
}
