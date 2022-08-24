import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

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

export interface PostType {
  name: string;
  price: number;
  description: string;
  thumbnails: string[];
  categoryId: number;
  authorId: number;
}
