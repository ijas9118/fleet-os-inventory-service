import type { IReservationRepository, IStockRepository } from "@/domain/repositories";

import { ReservationNotFoundError } from "@/domain/errors";

import type { ReleaseReservationDTO } from "./release-reservation.dto";

export class ReleaseReservationUseCase {
  constructor(
    private _reservationRepo: IReservationRepository,
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: ReleaseReservationDTO): Promise<void> {
    // Find reservation
    const reservation = await this._reservationRepo.findById(dto.reservationId, dto.tenantId);

    if (!reservation) {
      throw new ReservationNotFoundError(dto.reservationId);
    }

    // If already released or expired, return success (idempotent)
    if (reservation.status === "RELEASED" || reservation.status === "EXPIRED") {
      return;
    }

    // Release stock for each item using entity-returning method
    for (const item of reservation.items) {
      const stock = await this._stockRepo.findByInventoryItemAndWarehouseForReservation(
        item.inventoryItemId,
        reservation.warehouseId,
        dto.tenantId,
      );

      if (stock) {
        // Release the reserved stock
        stock.releaseReserved(item.quantity);

        // Update stock in database
        await this._stockRepo.update(stock.id!, stock.propsSnapshot);
      }
    }

    // Mark reservation as released
    reservation.release();

    // Update reservation in database
    await this._reservationRepo.update(dto.reservationId, reservation.propsSnapshot);
  }
}
