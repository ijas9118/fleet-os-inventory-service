import type { ReservationItem } from "@/domain/entities";
import type { IReservationRepository, IStockRepository } from "@/domain/repositories";

import { Reservation } from "@/domain/entities";
import { ReservationStatus } from "@/domain/enums";
import { InsufficientStockError } from "@/domain/errors";

import type { ReserveStockDTO, ReserveStockResponseDTO } from "./reserve-stock.dto";

export class ReserveStockUseCase {
  constructor(
    private _reservationRepo: IReservationRepository,
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: ReserveStockDTO): Promise<ReserveStockResponseDTO> {
    // Calculate expiry time (default 24 hours)
    const expiryHours = dto.expiryHours || 24;
    const reservedAt = new Date();
    const expiresAt = new Date(reservedAt.getTime() + expiryHours * 60 * 60 * 1000);

    // Prepare reservation items and validate stock availability
    const reservationItems: ReservationItem[] = [];

    for (const item of dto.items) {
      // Find stock record for this item in the warehouse (entity for reservation)
      const stock = await this._stockRepo.findByInventoryItemAndWarehouseForReservation(
        item.inventoryItemId,
        dto.warehouseId,
        dto.tenantId,
      );

      if (!stock) {
        throw new InsufficientStockError(
          item.sku,
          item.quantity,
          0,
        );
      }

      // Check if there's enough available quantity
      if (stock.availableQuantity < item.quantity) {
        throw new InsufficientStockError(
          item.sku,
          item.quantity,
          stock.availableQuantity,
        );
      }

      // Reserve the stock
      stock.reserve(item.quantity);

      // Update stock in database
      await this._stockRepo.update(stock.id!, stock.propsSnapshot);

      // Add to reservation items
      reservationItems.push({
        inventoryItemId: item.inventoryItemId,
        stockId: stock.id!,
        sku: item.sku,
        quantity: item.quantity,
      });
    }

    // Create reservation entity
    const reservation = new Reservation({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      shipmentId: dto.shipmentId,
      items: reservationItems,
      status: ReservationStatus.RESERVED,
      reservedAt,
      expiresAt,
    });

    // Save reservation
    const savedReservation = await this._reservationRepo.create(reservation);

    return {
      reservationId: savedReservation.id!,
      success: true,
      expiresAt,
    };
  }
}
