export interface AddStockDTO {
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  quantity: number;
  notes?: string;
  referenceId?: string;
}
