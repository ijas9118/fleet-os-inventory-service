import type { InventoryReservationStatus } from "../enums";

import { DomainError } from "../entities/domain.error";

export class InvalidReservationStatusTransitionError extends DomainError {
  constructor(from: InventoryReservationStatus, to: InventoryReservationStatus) {
    super(`Invalid reservation status transition: ${from} → ${to}`);
  }
}
