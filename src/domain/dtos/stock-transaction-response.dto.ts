import type { InventoryItemInfo, WarehouseInfo } from "./stock-response.dto";

export interface StockTransactionResponseDTO {
  id: string;
  tenantId: string;
  warehouseId: string;
  warehouse: WarehouseInfo;
  inventoryItemId: string;
  inventoryItem: InventoryItemInfo;
  type: string;
  quantity: number;
  notes?: string;
  referenceId?: string;
  relatedTransactionId?: string;
  createdAt: Date;
}
