import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../auth/auth.service';
import { ProductService } from './product.service';
import {
  CreateProductDTO,
  ModifyProductDTO,
  ProductLikeRequestBody,
  ProductParam,
  ProductsGetOptions,
} from './types/product';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  @Post('write')
  async writePost(@Body() post: CreateProductDTO) {
    return this.productService.writePost({
      ...post,
      thumbnails: JSON.parse(post.thumbnails),
    });
  }

  @Post(':productId/like')
  likeOrDislikeProduct(
    @Body() { isLiked, userId }: ProductLikeRequestBody,
    @Param() { productId }: ProductParam,
  ) {
    return this.productService.likeOrDislikeProduct({
      userId,
      productId,
      isLiked,
    });
  }

  @Patch(':productId')
  modifyProductById(
    @Param()
    { productId }: ProductParam,
    @Body()
    modifyProductDto: Partial<ModifyProductDTO>,
  ) {
    return this.productService.modifyPostById(productId, {
      ...modifyProductDto,
      thumbnails: JSON.parse(modifyProductDto.thumbnails),
    });
  }

  @Delete(':productId')
  deleteProductById(
    @Param()
    { productId }: ProductParam,
  ) {
    return this.productService.deletePostById(productId);
  }

  @Get(':productId')
  getProductById(
    @Param()
    { productId }: ProductParam,
  ) {
    return this.productService.getProductById(productId);
  }

  @Get()
  getProducts(
    @Query()
    query: ProductsGetOptions,
  ) {
    return this.productService.getProducts(query);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('thumbnails', 10, {
      limits: {
        files: 10,
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  uploadThumbnails(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.productService.uploadThumbnails(files);
  }
}
