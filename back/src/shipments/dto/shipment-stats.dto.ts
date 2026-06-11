// NUEVO: src/shipments/dto/shipment-stats.dto.ts (opcional, para tipado)
export interface ShipmentStats {
    total: number;
    byStatus: {
        [key: string]: number;
    };
    byCarrier: {
        own: number;
        external: number;
    };
    pendingShipments: number;
    delayedShipments: number;
    averageDeliveryDays: number;
    recentShipments: number;
}