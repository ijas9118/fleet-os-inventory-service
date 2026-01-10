export interface WarehouseInfo {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface InventoryItemInfo {
  id: string;
  sku: string;
  name: string;
  category?: string;
  unit: string;
}

export interface StockResponseDTO {
  id: string;
  tenantId: string;
  warehouseId: string;
  warehouse: WarehouseInfo;
  inventoryItemId: string;
  inventoryItem: InventoryItemInfo;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
