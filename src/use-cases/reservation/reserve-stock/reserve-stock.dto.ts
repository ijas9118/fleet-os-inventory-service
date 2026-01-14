export interface ReserveStockDTO {
  tenantId: string;
  warehouseId: string;
  shipmentId?: string;
  items: Array<{
    inventoryItemId: string;
    sku: string;
    quantity: number;
  }>;
  expiryHours?: number;
}

export interface ReserveStockResponseDTO {
  reservationId: string;
  success: boolean;
  expiresAt: Date;
}
