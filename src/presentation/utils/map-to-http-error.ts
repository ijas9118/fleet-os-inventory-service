import {
  AppError,
  // BadRequestError,
  // ForbiddenError,
  // NotFoundError,
} from "../errors";

export function mapToHttpError(err: unknown): AppError {
  if (err instanceof AppError)
    return err;

  // For unexpected errors
  return new AppError("Internal Server Error");
}
