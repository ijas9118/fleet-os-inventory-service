import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import { AppError } from "./app.error";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.CONFLICT, "CONFLICT");
  }
}
