// src/shipments/shipments.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThan } from 'typeorm';
import { Shipment, ShipmentStatus, CarrierType } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ShipmentsService {
    private readonly logger = new Logger(ShipmentsService.name);

    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentsRepository: Repository<Shipment>,
        private readonly ordersService: OrdersService,
    ) { }

    async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
        // Verificar que la orden existe
        const order = await this.ordersService.findOne(createShipmentDto.orderId);

        // Verificar que no exista un envío para esta orden
        const existingShipment = await this.shipmentsRepository.findOne({
            where: { orderId: createShipmentDto.orderId },
        });

        if (existingShipment) {
            throw new ConflictException(`Ya existe un envío para la orden ${createShipmentDto.orderId}`);
        }

        // Verificar tracking number único
        const existingTracking = await this.shipmentsRepository.findOne({
            where: { trackingNumber: createShipmentDto.trackingNumber },
        });

        if (existingTracking) {
            throw new ConflictException(`El número de seguimiento ${createShipmentDto.trackingNumber} ya existe`);
        }

        // Crear historial inicial
        const initialHistory = [
            {
                status: createShipmentDto.status || ShipmentStatus.RECEIVED,
                location: 'Planta La Serena',
                timestamp: new Date(),
                description: 'Pedido recibido y en proceso de preparación'
            }
        ];

        const shipment = this.shipmentsRepository.create({
            ...createShipmentDto,
            status: createShipmentDto.status || ShipmentStatus.RECEIVED,
            trackingHistory: initialHistory,
        });

        const saved = await this.shipmentsRepository.save(shipment);

        this.logger.log(`✅ Envío creado: ${saved.trackingNumber} para orden ${saved.orderId}`);

        return saved;
    }

    async findAll(
        status?: ShipmentStatus,
        carrier?: CarrierType,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: Shipment[]; total: number; page: number; totalPages: number }> {
        const where: FindOptionsWhere<Shipment> = {};

        if (status) {
            where.status = status;
        }
        if (carrier) {
            where.carrier = carrier;
        }

        const [data, total] = await this.shipmentsRepository.findAndCount({
            where,
            relations: {
                order: {
                    items: {
                        product: true,
                    },
                },
                user: true,
            },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Shipment> {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id },
            relations: {
                order: {
                    items: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if (!shipment) {
            throw new NotFoundException(`Envío con ID ${id} no encontrado`);
        }

        return shipment;
    }

    async findByTrackingNumber(trackingNumber: string): Promise<Shipment> {
        const shipment = await this.shipmentsRepository.findOne({
            where: { trackingNumber },
            relations: {
                order: {
                    items: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if (!shipment) {
            throw new NotFoundException(`Envío con número ${trackingNumber} no encontrado`);
        }

        return shipment;
    }

    async findByOrderId(orderId: string): Promise<Shipment | null> {
        return this.shipmentsRepository.findOne({
            where: { orderId },
            relations: {
                order: {
                    items: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }

    async update(id: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
        const shipment = await this.findOne(id);

        // Si se actualiza el tracking number, verificar unicidad
        if (updateShipmentDto.trackingNumber && updateShipmentDto.trackingNumber !== shipment.trackingNumber) {
            const existing = await this.shipmentsRepository.findOne({
                where: { trackingNumber: updateShipmentDto.trackingNumber },
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`El número de seguimiento ${updateShipmentDto.trackingNumber} ya existe`);
            }
        }

        // Si el estado cambia a TRANSIT, asignar shippedAt y agregar al historial
        if (updateShipmentDto.status === ShipmentStatus.TRANSIT && shipment.status !== ShipmentStatus.TRANSIT) {
            (updateShipmentDto as any).shippedAt = new Date();

            // Agregar al historial
            const historyEntry = {
                status: ShipmentStatus.TRANSIT,
                location: 'En ruta de entrega',
                timestamp: new Date(),
                description: 'Pedido despachado y en camino al destino'
            };

            if (!shipment.trackingHistory) {
                shipment.trackingHistory = [];
            }
            shipment.trackingHistory.push(historyEntry);
        }

        // Si el estado cambia a DELIVERED, asignar deliveredAt y agregar al historial
        if (updateShipmentDto.status === ShipmentStatus.DELIVERED && shipment.status !== ShipmentStatus.DELIVERED) {
            (updateShipmentDto as any).deliveredAt = new Date();

            // Agregar al historial
            const historyEntry = {
                status: ShipmentStatus.DELIVERED,
                location: 'Dirección de destino',
                timestamp: new Date(),
                description: 'Pedido entregado al destinatario'
            };

            if (!shipment.trackingHistory) {
                shipment.trackingHistory = [];
            }
            shipment.trackingHistory.push(historyEntry);
        }

        Object.assign(shipment, updateShipmentDto);

        const updated = await this.shipmentsRepository.save(shipment);

        this.logger.log(`✅ Envío actualizado: ${updated.trackingNumber} - Estado: ${updated.status}`);

        return updated;
    }

    async updateStatus(id: string, updateStatusDto: UpdateShipmentStatusDto): Promise<Shipment> {
        const shipment = await this.findOne(id);
        const oldStatus = shipment.status;
        const newStatus = updateStatusDto.status;

        // Evitar actualizar si el estado es el mismo
        if (oldStatus === newStatus) {
            throw new BadRequestException(`El envío ya está en estado ${newStatus}`);
        }

        // Obtener ubicación según el nuevo estado
        const location = this.getLocationForStatus(newStatus);

        // Obtener descripción según el cambio de estado
        const description = this.getDescriptionForStatusChange(oldStatus, newStatus);

        // Agregar al historial
        const historyEntry = {
            status: newStatus,
            location: location,
            timestamp: new Date(),
            description: description
        };

        if (!shipment.trackingHistory) {
            shipment.trackingHistory = [];
        }
        shipment.trackingHistory.push(historyEntry);

        shipment.status = newStatus;

        if (newStatus === ShipmentStatus.TRANSIT && !shipment.shippedAt) {
            shipment.shippedAt = new Date();
        }

        if (newStatus === ShipmentStatus.DELIVERED && !shipment.deliveredAt) {
            shipment.deliveredAt = new Date();
        }

        // Actualizar el estado de la orden relacionada
        await this.ordersService.update(shipment.orderId, {
            status: this.mapShipmentStatusToOrderStatus(newStatus),
        });

        const updated = await this.shipmentsRepository.save(shipment);

        this.logger.log(`✅ Estado de envío actualizado: ${updated.trackingNumber} -> ${updated.status}`);

        return updated;
    }

    private getLocationForStatus(status: ShipmentStatus): string {
        const locations = {
            [ShipmentStatus.RECEIVED]: 'Planta La Serena',
            [ShipmentStatus.PREPARING]: 'Taller de Bordado',
            [ShipmentStatus.TRANSIT]: 'En ruta de entrega',
            [ShipmentStatus.DELIVERED]: 'Dirección de destino'
        };
        return locations[status] || 'En proceso';
    }

    private getDescriptionForStatusChange(oldStatus: ShipmentStatus, newStatus: ShipmentStatus): string {
        const descriptions = {
            [ShipmentStatus.RECEIVED]: 'Pedido recibido y en proceso de preparación',
            [ShipmentStatus.PREPARING]: 'Pedido en preparación y proceso de bordado',
            [ShipmentStatus.TRANSIT]: 'Pedido despachado y en camino al destino',
            [ShipmentStatus.DELIVERED]: 'Pedido entregado al destinatario'
        };
        return descriptions[newStatus] || `Estado cambiado de ${oldStatus} a ${newStatus}`;
    }

    private mapShipmentStatusToOrderStatus(shipmentStatus: ShipmentStatus): string {
        const map = {
            [ShipmentStatus.RECEIVED]: 'PENDING',
            [ShipmentStatus.PREPARING]: 'PAID',
            [ShipmentStatus.TRANSIT]: 'PAID',
            [ShipmentStatus.DELIVERED]: 'DELIVERED',
        };
        return map[shipmentStatus] || 'PENDING';
    }

    async remove(id: string): Promise<{ message: string }> {
        const shipment = await this.findOne(id);
        await this.shipmentsRepository.remove(shipment);
        this.logger.log(`✅ Envío eliminado: ${shipment.trackingNumber}`);
        return { message: `Envío con ID ${id} eliminado correctamente` };
    }

    async getStats(): Promise<{
        total: number;
        byStatus: Record<ShipmentStatus, number>;
        byCarrier: Record<CarrierType, number>;
        pendingShipments: number;
        delayedShipments: number;
        averageDeliveryDays: number;
        recentShipments: number;
    }> {
        const total = await this.shipmentsRepository.count();

        const byStatus = {
            [ShipmentStatus.RECEIVED]: await this.shipmentsRepository.count({ where: { status: ShipmentStatus.RECEIVED } }),
            [ShipmentStatus.PREPARING]: await this.shipmentsRepository.count({ where: { status: ShipmentStatus.PREPARING } }),
            [ShipmentStatus.TRANSIT]: await this.shipmentsRepository.count({ where: { status: ShipmentStatus.TRANSIT } }),
            [ShipmentStatus.DELIVERED]: await this.shipmentsRepository.count({ where: { status: ShipmentStatus.DELIVERED } }),
        };

        const byCarrier = {
            [CarrierType.OWN]: await this.shipmentsRepository.count({ where: { carrier: CarrierType.OWN } }),
            [CarrierType.EXTERNAL]: await this.shipmentsRepository.count({ where: { carrier: CarrierType.EXTERNAL } }),
        };

        const pendingShipments = await this.shipmentsRepository.count({
            where: [
                { status: ShipmentStatus.RECEIVED },
                { status: ShipmentStatus.PREPARING },
            ],
        });

        // Calcular días promedio de entrega (solo entregados)
        const deliveredShipments = await this.shipmentsRepository.find({
            where: { status: ShipmentStatus.DELIVERED },
        });

        let averageDeliveryDays = 0;
        if (deliveredShipments.length > 0) {
            const totalDays = deliveredShipments.reduce((sum, shipment) => {
                if (shipment.createdAt && shipment.deliveredAt) {
                    const days = Math.ceil((shipment.deliveredAt.getTime() - shipment.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return sum + days;
                }
                return sum;
            }, 0);
            averageDeliveryDays = Math.round(totalDays / deliveredShipments.length);
        }

        // Envíos del último mes
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const recentShipments = await this.shipmentsRepository.count({
            where: { createdAt: MoreThan(lastMonth) },
        });

        return {
            total,
            byStatus,
            byCarrier,
            pendingShipments,
            delayedShipments: 0, // Puedes implementar lógica de atrasos si es necesario
            averageDeliveryDays,
            recentShipments,
        };
    }

    async getUserShipments(userId: string): Promise<Shipment[]> {
        return this.shipmentsRepository.find({
            where: { userId },
            relations: {
                order: {
                    items: {
                        product: true,
                    },
                },
            },
            order: { createdAt: 'DESC' },
        });
    }

    // Método para generar número de seguimiento único
    generateTrackingNumber(orderId: string): string {
        const shortId = orderId.slice(-8).toUpperCase();
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ELD-${year}${month}${day}-${shortId}-${random}`;
    }

    // Método para crear envío automático desde una orden
    async createFromOrder(orderId: string, userId: string): Promise<Shipment> {
        // Verificar que no exista un envío para esta orden
        const existingShipment = await this.shipmentsRepository.findOne({
            where: { orderId },
        });

        if (existingShipment) {
            this.logger.log(`Ya existe un envío para la orden ${orderId}`);
            return existingShipment;
        }

        const trackingNumber = this.generateTrackingNumber(orderId);

        const initialHistory = [
            {
                status: ShipmentStatus.RECEIVED,
                location: 'Planta La Serena',
                timestamp: new Date(),
                description: 'Pedido recibido y en proceso de preparación'
            }
        ];

        const shipment = this.shipmentsRepository.create({
            orderId,
            userId,
            trackingNumber,
            carrier: CarrierType.OWN,
            status: ShipmentStatus.RECEIVED,
            trackingHistory: initialHistory,
        });

        const saved = await this.shipmentsRepository.save(shipment);
        this.logger.log(`✅ Envío automático creado: ${saved.trackingNumber} para orden ${orderId}`);

        return saved;
    }

    // Método para agregar evento al historial de seguimiento
    async addTrackingEvent(
        shipmentId: string,
        status: ShipmentStatus,
        location: string,
        description: string
    ): Promise<Shipment> {
        const shipment = await this.findOne(shipmentId);

        const historyEntry = {
            status,
            location,
            timestamp: new Date(),
            description
        };

        if (!shipment.trackingHistory) {
            shipment.trackingHistory = [];
        }
        shipment.trackingHistory.push(historyEntry);
        shipment.status = status;

        if (status === ShipmentStatus.TRANSIT && !shipment.shippedAt) {
            shipment.shippedAt = new Date();
        }

        if (status === ShipmentStatus.DELIVERED && !shipment.deliveredAt) {
            shipment.deliveredAt = new Date();
        }

        const updated = await this.shipmentsRepository.save(shipment);
        this.logger.log(`✅ Evento agregado al envío ${shipment.trackingNumber}: ${status} - ${description}`);

        return updated;
    }
}