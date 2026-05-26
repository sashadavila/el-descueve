import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear un producto',
    description: 'Solo administradores pueden crear productos.',
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      productoTrabajo: {
        summary: 'Producto de ropa de trabajo',
        value: {
          name: 'Camisa de trabajo azul',
          description: 'Camisa resistente para uso laboral diario.',
          price: 12500,
          categoryId: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
          size: 'M',
          color: 'Azul',
          stock: 20,
          imageUrl: 'https://res.cloudinary.com/demo/product-image.jpg',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.', type: Product })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos',
    description: 'Endpoint público para listar productos visibles en la tienda.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de productos obtenido correctamente.',
    type: [Product],
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Endpoint público para ver el detalle de un producto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID del producto',
    example: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
  })
  @ApiResponse({ status: 200, description: 'Producto encontrado correctamente.', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar un producto',
    description: 'Solo administradores pueden actualizar productos.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID del producto',
    example: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
  })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      actualizarStock: {
        summary: 'Actualizar stock',
        value: {
          stock: 35,
        },
      },
      actualizarProductoCompleto: {
        summary: 'Actualizar varios campos',
        value: {
          name: 'Camisa de trabajo azul reforzada',
          description: 'Camisa resistente para uso laboral diario con tela reforzada.',
          price: 15500,
          categoryId: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
          size: 'L',
          color: 'Azul',
          stock: 25,
          imageUrl: 'https://res.cloudinary.com/demo/camisa-reforzada.jpg',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente.', type: Product })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar un producto',
    description: 'Solo administradores pueden eliminar productos.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID del producto',
    example: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente.',
    schema: {
      example: {
        message:
          'Producto con ID b7d5f4b2-1e7a-4a12-9a41-123456789abc eliminado correctamente',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }
}