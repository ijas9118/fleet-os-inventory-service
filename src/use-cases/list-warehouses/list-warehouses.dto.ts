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

export interface ListWarehousesParams {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface PaginatedWarehousesResponse {
  data: ListWarehousesDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
