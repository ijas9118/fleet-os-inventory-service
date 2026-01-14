import { InsufficientStockError, WarehouseCodeAlreadyExistsError, WarehouseNotFoundError } from "@/domain/errors";

import { BadRequestError, ConflictError, NotFoundError } from "../errors";

export function mapToHttpError(err: unknown) {
  if (err instanceof WarehouseCodeAlreadyExistsError) {
    return new ConflictError(err.message);
  }

  if (err instanceof WarehouseNotFoundError) {
    return new NotFoundError(err.message);
  }

  if (err instanceof InsufficientStockError) {
    // Return BadRequestError with additional metadata for insufficient stock
    const error = new BadRequestError(err.message);
    (error as any).code = "INSUFFICIENT_STOCK";
    (error as any).sku = err.sku;
    (error as any).requested = err.requested;
    (error as any).available = err.available;
    return error;
  }

  if (err instanceof Error) {
    return new BadRequestError(err.message);
  }

  return new BadRequestError("Unknown error occurred");
}
