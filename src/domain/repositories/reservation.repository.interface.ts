import type { Reservation, ReservationProps } from "../entities/reservation.entity";

export interface IReservationRepository {
  create: (reservation: Reservation) => Promise<Reservation>;
  findById: (id: string, tenantId: string) => Promise<Reservation | null>;
  findByShipmentId: (shipmentId: string) => Promise<Reservation | null>;
  findExpired: () => Promise<Reservation[]>;
  update: (id: string, updates: Partial<ReservationProps>) => Promise<void>;
}
