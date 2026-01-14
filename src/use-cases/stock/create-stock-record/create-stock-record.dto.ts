export interface CreateStockRecordDTO {
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  initialQuantity?: number;
}
