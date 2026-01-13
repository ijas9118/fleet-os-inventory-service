import type { ReservationStatus } from "../enums/reservation-status.enum";

import { ValidationError } from "../errors";

export interface ReservationItem {
  inventoryItemId: string;
  stockId: string;
  sku: string;
  quantity: number;
}

export interface ReservationProps {
  id?: string;
  tenantId: string;
  warehouseId: string;
  shipmentId?: string;
  items: ReservationItem[];
  status: ReservationStatus;
  reservedAt: Date;
  expiresAt: Date;
  releasedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation {
  private readonly _props: ReservationProps;

  constructor(props: ReservationProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: ReservationProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.warehouseId || props.warehouseId.trim() === "") {
      throw new ValidationError("Warehouse ID is required");
    }

    if (!props.items || props.items.length === 0) {
      throw new ValidationError("At least one item is required for reservation");
    }

    // Validate items
    for (const item of props.items) {
      if (!item.inventoryItemId || item.inventoryItemId.trim() === "") {
        throw new ValidationError("Inventory item ID is required for each item");
      }

      if (!item.stockId || item.stockId.trim() === "") {
        throw new ValidationError("Stock ID is required for each item");
      }

      if (!item.sku || item.sku.trim() === "") {
        throw new ValidationError("SKU is required for each item");
      }

      if (item.quantity <= 0) {
        throw new ValidationError(`Quantity must be greater than zero for item ${item.sku}`);
      }
    }

    if (!props.reservedAt) {
      throw new ValidationError("Reserved at date is required");
    }

    if (!props.expiresAt) {
      throw new ValidationError("Expires at date is required");
    }

    if (props.expiresAt <= props.reservedAt) {
      throw new ValidationError("Expiry date must be after reserved date");
    }
  }

  // Getters
  get id(): string | undefined {
    return this._props.id;
  }

  get tenantId(): string {
    return this._props.tenantId;
  }

  get warehouseId(): string {
    return this._props.warehouseId;
  }

  get shipmentId(): string | undefined {
    return this._props.shipmentId;
  }

  get items(): ReservationItem[] {
    return [...this._props.items];
  }

  get status(): ReservationStatus {
    return this._props.status;
  }

  get reservedAt(): Date {
    return this._props.reservedAt;
  }

  get expiresAt(): Date {
    return this._props.expiresAt;
  }

  get releasedAt(): Date | undefined {
    return this._props.releasedAt;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get propsSnapshot(): ReservationProps {
    return {
      ...this._props,
      items: [...this._props.items],
    };
  }

  // Business methods
  isExpired(): boolean {
    return new Date() > this._props.expiresAt && this._props.status === "RESERVED";
  }

  release(): void {
    if (this._props.status === "RELEASED") {
      return; // Idempotent
    }

    this._props.status = "RELEASED" as ReservationStatus;
    this._props.releasedAt = new Date();
    this._props.updatedAt = new Date();
  }

  expire(): void {
    if (this._props.status !== "RESERVED") {
      return; // Only expire if still reserved
    }

    this._props.status = "EXPIRED" as ReservationStatus;
    this._props.updatedAt = new Date();
  }
}
