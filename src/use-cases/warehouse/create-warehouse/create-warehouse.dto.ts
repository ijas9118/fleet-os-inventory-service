import type { Address } from "@/domain/entities";

export { AddressSchema, CreateWarehouseDTOSchema, type CreateWarehouseSchemaType } from "./create-warehouse.schema";

export interface CreateWarehouseDTO {
  tenantId: string;
  name: string;
  code: string;
  address: Address;
}
