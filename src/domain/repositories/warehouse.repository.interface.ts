import type { Warehouse, WarehouseProps } from "../entities/warehouse.entity";

export interface IWareHouseRepository {
  createWarehouse: (props: WarehouseProps) => Promise<Warehouse>;
  findByCode: (code: string) => Promise<Warehouse | null>;
  // getWarehouse: (warehouseId: string, tenantId: string) => Promise<Warehouse | null>;
  // listWarehouses: (tenantId: string, assignedManagerUserId?: string) => Promise<Warehouse[]>;
  // updateWarehouse: (warehouseId: string, updates: Partial<WarehouseProps>) => Promise<Warehouse>;
}
