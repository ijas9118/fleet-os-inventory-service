export class SkuAlreadyExistsError extends Error {
  constructor(sku: string) {
    super(`An inventory item with SKU '${sku}' already exists`);
    this.name = "SkuAlreadyExistsError";
  }
}
