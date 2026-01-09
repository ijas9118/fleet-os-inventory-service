export interface AdjustStockDTO {
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  adjustment: number; // Positive or negative
  notes?: string;
  referenceId?: string;
}
