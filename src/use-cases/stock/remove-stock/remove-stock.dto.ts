export interface RemoveStockDTO {
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  quantity: number;
  notes?: string;
  referenceId?: string;
}
