import type { Stock } from "../entities";

export interface ListStockOptions {
  tenantId: string;
  page: number;
  limit: number;
  warehouseId?: string;
  inventoryItemId?: string;
}

export interface IStockRepository {
  create: (stock: Stock) => Promise<Stock>;
  findById: (id: string, tenantId: string) => Promise<Stock | null>;
  findByWarehouseAndItem: (
    warehouseId: string,
    inventoryItemId: string,
    tenantId: string,
  ) => Promise<Stock | null>;
  findByWarehouse: (
    warehouseId: string,
    tenantId: string,
    options: { page: number; limit: number },
  ) => Promise<{ items: Stock[]; total: number }>;
  findByItem: (inventoryItemId: string, tenantId: string) => Promise<Stock[]>;
  list: (options: ListStockOptions) => Promise<{ items: Stock[]; total: number }>;
  update: (id: string, updates: Partial<Stock>) => Promise<void>;
}
