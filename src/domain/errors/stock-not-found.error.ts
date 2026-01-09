export class StockNotFoundError extends Error {
  constructor(stockId: string) {
    super(`Stock record ${stockId} not found`);
    this.name = "StockNotFoundError";
  }
}
