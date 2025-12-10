import { InventoryReservationStatus } from "../enums";

export const reservationValidTransitions: Record<
  InventoryReservationStatus,
  InventoryReservationStatus[]
> = {
  [InventoryReservationStatus.PENDING]: [
    InventoryReservationStatus.RESERVED,
    InventoryReservationStatus.PARTIALLY_RESERVED,
    InventoryReservationStatus.FAILED,
    InventoryReservationStatus.CANCELLED,
    InventoryReservationStatus.EXPIRED,
  ],

  [InventoryReservationStatus.PARTIALLY_RESERVED]: [
    InventoryReservationStatus.RESERVED,
    InventoryReservationStatus.FAILED,
    InventoryReservationStatus.CANCELLED,
    InventoryReservationStatus.EXPIRED,
  ],

  [InventoryReservationStatus.RESERVED]: [
    InventoryReservationStatus.CONSUMED,
    InventoryReservationStatus.RELEASED,
    InventoryReservationStatus.EXPIRED,
    InventoryReservationStatus.CANCELLED,
  ],

  [InventoryReservationStatus.CONSUMED]: [],
  [InventoryReservationStatus.RELEASED]: [],
  [InventoryReservationStatus.FAILED]: [],
  [InventoryReservationStatus.EXPIRED]: [],
  [InventoryReservationStatus.CANCELLED]: [],
};
