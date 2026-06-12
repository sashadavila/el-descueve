// src/shipments/shipments.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { Shipment, ShipmentStatus, CarrierType } from './entities/shipment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentsController {
    constructor(private readonly shipmentsService: ShipmentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo envío (admin)' })
    @ApiResponse({ status: 201, description: 'Envío creado correctamente.' })
    async create(@Body() createShipmentDto: CreateShipmentDto): Promise<Shipment> {
        return this.shipmentsService.create(createShipmentDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todos los envíos (admin)' })
    @ApiQuery({ name: 'status', required: false, enum: ShipmentStatus })
    @ApiQuery({ name: 'carrier', required: false, enum: CarrierType })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async findAll(
        @Query('status') status?: ShipmentStatus,
        @Query('carrier') carrier?: CarrierType,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.shipmentsService.findAll(
            status,
            carrier,
            parseInt(page),
            parseInt(limit),
        );
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener estadísticas de envíos (admin)' })
    async getStats() {
        return this.shipmentsService.getStats();
    }

    @Get('tracking/:trackingNumber')
    @Public()
    @ApiOperation({ summary: 'Seguimiento público por número de tracking' })
    async findByTrackingNumber(@Param('trackingNumber') trackingNumber: string): Promise<Shipment> {
        return this.shipmentsService.findByTrackingNumber(trackingNumber);
    }

    @Get('order/:orderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener envío por ID de orden' })
    async findByOrderId(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<Shipment | null> {
        return this.shipmentsService.findByOrderId(orderId);
    }

    @Get('my-shipments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mis envíos (cliente autenticado)' })
    async getMyShipments(@Req() req: any): Promise<Shipment[]> {
        return this.shipmentsService.getUserShipments(req.user.id);
    }

    @Get('tracking/order/:orderId')
    @Public()  // Opcional: hacerlo público para que clientes puedan ver sin login
    @ApiOperation({ summary: 'Obtener seguimiento por ID de orden' })
    async getTrackingByOrderId(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<Shipment | null> {
        return this.shipmentsService.findByOrderId(orderId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener un envío por ID (admin)' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Shipment> {
        return this.shipmentsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un envío (admin)' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateShipmentDto: UpdateShipmentDto,
    ): Promise<Shipment> {
        return this.shipmentsService.update(id, updateShipmentDto);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar solo el estado de un envío (admin)' })
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStatusDto: UpdateShipmentStatusDto,
    ): Promise<Shipment> {
        return this.shipmentsService.updateStatus(id, updateStatusDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un envío (admin)' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.shipmentsService.remove(id);
    }

    @Post('from-order/:orderId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear envío a partir de una orden existente (admin)' })
    async createFromOrder(
        @Param('orderId', ParseUUIDPipe) orderId: string,
        @Body('userId') userId: string
    ): Promise<Shipment> {
        return this.shipmentsService.createFromOrder(orderId, userId);
    }
}