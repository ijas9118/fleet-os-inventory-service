export class InventoryItemNotFoundError extends Error {
  constructor(itemId: string) {
    super(`Inventory item ${itemId} not found`);
    this.name = "InventoryItemNotFoundError";
  }
}
