import type { Address } from "@/domain/entities";
import type { WarehouseStatus } from "@/domain/enums";

export interface ListWarehousesDTO {
  id: string;
  code: string;
  name: string;
  address: Address;
  status: WarehouseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
