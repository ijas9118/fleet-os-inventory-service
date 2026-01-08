import type { InventoryItem } from "../entities";

export interface ListInventoryItemsOptions {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface IInventoryItemRepository {
  create: (item: InventoryItem) => Promise<InventoryItem>;
  findById: (id: string, tenantId: string) => Promise<InventoryItem | null>;
  findBySku: (sku: string, tenantId: string) => Promise<InventoryItem | null>;
  list: (options: ListInventoryItemsOptions) => Promise<{ items: InventoryItem[]; total: number }>;
  update: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  archive: (id: string) => Promise<void>;
}
