import { DomainError } from "../entities";

export class WarehouseNotFoundError extends DomainError {
  constructor(warehouseId: string) {
    super(`Warehouse with ID '${warehouseId}' not found`);
  }
}
