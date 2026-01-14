export interface ListStockDTO {
  tenantId: string;
  page: number;
  limit: number;
  warehouseId?: string;
  inventoryItemId?: string;
}
