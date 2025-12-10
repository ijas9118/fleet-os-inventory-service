import type { UOM } from "../enums";

import { InventoryReservationStatus } from "../enums";
import { InvalidReservationStatusTransitionError } from "../errors/invalid-reservation-status-transition.error";
import { reservationValidTransitions } from "../rules/reservation-valid-transactions.rules";

export interface InventoryReservationItem {
  inventoryItemId: string;
  reservedQuantity: number;
  uom: UOM;
}

export interface InventoryReservationProps {
  id?: string;
  tenantId: string;
  shipmentId: string;
  originWarehouseId: string;
  reservedByUserId: string;
  items: InventoryReservationItem[];
  status: InventoryReservationStatus;
  expiresAt?: Date;
  correlationId?: string;
}

export class InventoryReservation {
  private props: InventoryReservationProps;

  constructor(props: InventoryReservationProps) {
    this.props = {
      ...props,
      status: InventoryReservationStatus.PENDING,
    };
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get shipmentId() { return this.props.shipmentId; }
  get status() { return this.props.status; }
  get propsSnapshot() { return this.props; }

  setStatus(status: InventoryReservationStatus) {
    const allowed = reservationValidTransitions[this.props.status];

    if (!allowed.includes(status)) {
      throw new InvalidReservationStatusTransitionError(
        this.props.status,
        status,
      );
    }
    this.props.status = status;
  }
}
