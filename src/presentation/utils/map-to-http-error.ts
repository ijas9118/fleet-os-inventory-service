import { WarehouseCodeAlreadyExistsError, WarehouseNotFoundError } from "@/domain/errors";

import { BadRequestError, ConflictError, NotFoundError } from "../errors";

export function mapToHttpError(err: unknown) {
  if (err instanceof WarehouseCodeAlreadyExistsError) {
    return new ConflictError(err.message);
  }

  if (err instanceof WarehouseNotFoundError) {
    return new NotFoundError(err.message);
  }

  if (err instanceof Error) {
    return new BadRequestError(err.message);
  }

  return new BadRequestError("Unknown error occurred");
}
