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

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({
    summary: 'Crear una orden',
    description:
      'Permite a un cliente o administrador crear una orden. Calcula subtotales, total y descuenta stock.',
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      ordenSimple: {
        summary: 'Orden con un producto',
        value: {
          userId: 'd4e2c96c-9f2d-4ed7-bfb9-123456789abc',
          items: [
            {
              productId: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
              quantity: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente.', type: Order })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todas las órdenes',
    description: 'Solo administradores pueden ver todas las órdenes.',
  })
  @ApiResponse({ status: 200, description: 'Listado de órdenes obtenido correctamente.', type: [Order] })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({
    summary: 'Obtener una orden por ID',
    description:
      'Permite consultar una orden específica. Más adelante podemos limitar para que el cliente solo vea sus propias órdenes.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la orden',
    example: 'c8f08d9a-91f1-4d8d-9c4e-123456789abc',
  })
  @ApiResponse({ status: 200, description: 'Orden encontrada correctamente.', type: Order })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar estado de una orden',
    description: 'Solo administradores pueden actualizar el estado de una orden.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la orden',
    example: 'c8f08d9a-91f1-4d8d-9c4e-123456789abc',
  })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      marcarPagada: {
        summary: 'Marcar como pagada',
        value: {
          status: 'PAID',
        },
      },
      marcarCancelada: {
        summary: 'Marcar como cancelada',
        value: {
          status: 'CANCELLED',
        },
      },
      marcarEntregada: {
        summary: 'Marcar como entregada',
        value: {
          status: 'DELIVERED',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Orden actualizada correctamente.', type: Order })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una orden',
    description: 'Solo administradores pueden eliminar una orden.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la orden',
    example: 'c8f08d9a-91f1-4d8d-9c4e-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden eliminada correctamente.',
    schema: {
      example: {
        message:
          'Orden con ID c8f08d9a-91f1-4d8d-9c4e-123456789abc eliminada correctamente',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.ordersService.remove(id);
  }
}