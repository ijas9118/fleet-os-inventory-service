import type { Warehouse, WarehouseProps } from "../entities";

export interface ListWarehousesOptions {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
  includeArchived?: boolean;
}

export interface IWareHouseRepository {
  createWarehouse: (props: WarehouseProps) => Promise<Warehouse>;
  findByCode: (code: string, tenantId: string) => Promise<Warehouse | null>;
  findById: (warehouseId: string, tenantId: string) => Promise<Warehouse | null>;
  listWarehouses: (options: ListWarehousesOptions) => Promise<{ warehouses: Warehouse[]; total: number }>;
  updateWarehouse: (warehouseId: string, updates: Partial<WarehouseProps>) => Promise<Warehouse>;
}
