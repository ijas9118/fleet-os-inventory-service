export interface UpdateInventoryItemDTO {
  itemId: string;
  tenantId: string;
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
}
