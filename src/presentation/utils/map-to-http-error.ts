import { InvalidReservationStatusTransitionError, WarehouseCodeAlreadyExistsError } from "@/domain/errors";

import {
  AppError,
  BadRequestError,
  ConflictError,
  // ForbiddenError,
  // NotFoundError,
} from "../errors";

export function mapToHttpError(err: unknown): AppError {
  if (err instanceof InvalidReservationStatusTransitionError)
    return new BadRequestError(err.message);

  if (err instanceof WarehouseCodeAlreadyExistsError)
    return new ConflictError(err.message);

  if (err instanceof AppError)
    return err;

  return new AppError("Internal Server Error");
}
