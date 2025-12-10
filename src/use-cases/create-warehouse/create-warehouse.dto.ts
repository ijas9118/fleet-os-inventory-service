import type { Address } from "@/domain/entities";

export interface CreateWarehouseDTO {
  tenantId: string;
  name: string;
  code: string;
  address: Address;
  assignedManagerUserId?: string;
}
