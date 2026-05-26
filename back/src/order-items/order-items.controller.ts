import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Order Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los items de órdenes',
    description:
      'Solo administradores pueden ver todos los items de órdenes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de items obtenido correctamente.',
    type: [OrderItem],
  })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un item de orden por ID',
    description: 'Solo administradores pueden ver el detalle de un item de orden.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID del item de orden',
    example: 'c8f08d9a-91f1-4d8d-9c4e-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado correctamente.',
    type: OrderItem,
  })
  @ApiResponse({ status: 401, description: 'Token no enviado o inválido.' })
  @ApiResponse({ status: 403, description: 'No tenés permisos de administrador.' })
  @ApiResponse({ status: 404, description: 'Item no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }
}