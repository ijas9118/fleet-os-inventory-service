import type { IReservationRepository } from "@/domain/repositories";
import type { RemoveStockUseCase } from "@/use-cases/stock/remove-stock";

import logger from "@/config/logger";
import { ReservationExpiredError, ReservationNotFoundError } from "@/domain/errors";
import { ValidationError } from "@/domain/errors/validation.error";

import type { ConfirmReservationDTO } from "./confirm-reservation.dto";

export class ConfirmReservationUseCase {
  constructor(
    private _reservationRepo: IReservationRepository,
    private _removeStockUC: RemoveStockUseCase,
  ) {}

  async execute(dto: ConfirmReservationDTO): Promise<void> {
    // Find reservation
    const reservation = await this._reservationRepo.findById(dto.reservationId, dto.tenantId);

    if (!reservation) {
      throw new ReservationNotFoundError(dto.reservationId);
    }

    // Check if already confirmed or released
    if (reservation.status === "CONFIRMED") {
      logger.info("Reservation already confirmed, skipping", { reservationId: dto.reservationId });
      return; // Idempotent
    }

    if (reservation.status === "RELEASED") {
      throw new ValidationError("Cannot confirm a released reservation");
    }

    // Check if expired
    if (reservation.isExpired()) {
      throw new ReservationExpiredError(dto.reservationId);
    }

    // Deduct actual stock for each reserved item
    for (const item of reservation.items) {
      await this._removeStockUC.execute({
        warehouseId: reservation.warehouseId,
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        tenantId: dto.tenantId,
        notes: `Confirmed reservation ${dto.reservationId} for shipment`,
      });

      logger.info("Deducted actual stock for confirmed reservation", {
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        reservationId: dto.reservationId,
      });
    }

    // Mark reservation as confirmed
    reservation.confirm();

    // Persist changes
    await this._reservationRepo.update(dto.reservationId, reservation.propsSnapshot);

    logger.info("Reservation confirmed successfully", {
      reservationId: dto.reservationId,
      itemsCount: reservation.items.length,
    });
  }
}
