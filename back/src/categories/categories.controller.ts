// src/categories/categories.controller.ts
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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator'; // ← Importar Public

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear una categoría',
    description: 'Solo administradores pueden crear categorías.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      ropaTrabajo: {
        summary: 'Ropa de trabajo',
        value: {
          name: 'Ropa de trabajo',
          description: 'Indumentaria laboral para trabajo industrial y oficina.',
          imageUrl: 'https://res.cloudinary.com/demo/ropa-trabajo.jpg',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Categoría creada correctamente.', type: Category })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Endpoint público para listar categorías visibles en la tienda.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de categorías obtenido correctamente.',
    type: [Category],
  })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description: 'Endpoint público para ver una categoría y sus productos asociados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la categoría',
    example: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
  })
  @ApiResponse({ status: 200, description: 'Categoría encontrada correctamente.', type: Category })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description: 'Solo administradores pueden actualizar categorías.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la categoría',
    example: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      actualizarNombre: {
        summary: 'Actualizar nombre',
        value: {
          name: 'Ropa laboral',
        },
      },
      desactivarCategoria: {
        summary: 'Desactivar categoría',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Categoría actualizada correctamente.', type: Category })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una categoría',
    description: 'Solo administradores pueden eliminar categorías.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la categoría',
    example: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada correctamente.',
    schema: {
      example: {
        message:
          'Categoría con ID 9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321 eliminada correctamente',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.categoriesService.remove(id);
  }
}