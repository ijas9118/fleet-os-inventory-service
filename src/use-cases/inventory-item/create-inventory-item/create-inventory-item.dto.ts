export interface CreateInventoryItemDTO {
  tenantId: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
}
