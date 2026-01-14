import { DomainError } from "../entities/domain.error";

export class ReservationNotFoundError extends DomainError {
  constructor(reservationId: string) {
    super(`Reservation not found with ID: ${reservationId}`);
  }
}
