export interface TransferStockDTO {
  tenantId: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  inventoryItemId: string;
  quantity: number;
  notes?: string;
  referenceId?: string;
}
