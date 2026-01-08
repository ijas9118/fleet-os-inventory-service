export class WarehouseArchivedError extends Error {
  constructor(warehouseId: string) {
    super(`Warehouse ${warehouseId} is archived and cannot be modified`);
    this.name = "WarehouseArchivedError";
  }
}
