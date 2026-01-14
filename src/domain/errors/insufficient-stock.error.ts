export class InsufficientStockError extends Error {
  constructor(
    public sku: string,
    public requested: number,
    public available: number,
  ) {
    super(`Insufficient stock for ${sku}. Available: ${available}, Requested: ${requested}`);
    this.name = "InsufficientStockError";
  }
}
