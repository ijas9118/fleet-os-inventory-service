import { DomainError } from "../entities/domain.error";

export class ReservationExpiredError extends DomainError {
  constructor(reservationId: string) {
    super(`Reservation ${reservationId} has expired`);
  }
}
