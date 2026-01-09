export class InsufficientStockError extends Error {
  constructor(available: number, requested: number) {
    super(`Insufficient stock. Available: ${available}, Requested: ${requested}`);
    this.name = "InsufficientStockError";
  }
}
