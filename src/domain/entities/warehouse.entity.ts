import type { WarehouseStatus } from "../enums";

import { ValidationError } from "../errors";

export interface Address {
  line1: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface WarehouseProps {
  id?: string;
  tenantId: string;
  name: string;
  code: string;
  address: Address;
  status: WarehouseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Warehouse {
  private readonly _props: WarehouseProps;

  constructor(props: WarehouseProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: WarehouseProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Warehouse name is required");
    }

    if (!props.code || props.code.trim() === "") {
      throw new ValidationError("Warehouse code is required");
    }

    if (!props.address) {
      throw new ValidationError("Warehouse address is required");
    }

    this._validateAddress(props.address);
  }

  private _validateAddress(address: Address): void {
    if (!address.line1 || address.line1.trim() === "") {
      throw new ValidationError("Address line1 is required");
    }

    if (!address.city || address.city.trim() === "") {
      throw new ValidationError("Address city is required");
    }

    if (!address.country || address.country.trim() === "") {
      throw new ValidationError("Address country is required");
    }

    if (!address.coordinates) {
      throw new ValidationError("Address coordinates are required");
    }

    const { lat, lng } = address.coordinates;
    if (lat < -90 || lat > 90) {
      throw new ValidationError("Invalid latitude: must be between -90 and 90");
    }
    if (lng < -180 || lng > 180) {
      throw new ValidationError("Invalid longitude: must be between -180 and 180");
    }
  }

  // Getters
  get id(): string | undefined {
    return this._props.id;
  }

  get tenantId(): string {
    return this._props.tenantId;
  }

  get name(): string {
    return this._props.name;
  }

  get code(): string {
    return this._props.code;
  }

  get address(): Address {
    return { ...this._props.address };
  }

  get status(): WarehouseStatus {
    return this._props.status;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get propsSnapshot(): WarehouseProps {
    return {
      ...this._props,
      address: { ...this._props.address },
    };
  }

  // Business methods
  activate(): void {
    this._props.status = "ACTIVE" as WarehouseStatus;
  }

  deactivate(): void {
    this._props.status = "MAINTENANCE" as WarehouseStatus;
  }

  close(): void {
    this._props.status = "CLOSED" as WarehouseStatus;
  }

  updateStatus(newStatus: WarehouseStatus): void {
    this._props.status = newStatus;
    this._props.updatedAt = new Date();
  }

  updateDetails(updates: {
    name?: string;
    address?: Address;
  }): void {
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim() === "") {
        throw new ValidationError("Warehouse name cannot be empty");
      }
      this._props.name = updates.name;
    }

    if (updates.address) {
      this._validateAddress(updates.address);
      this._props.address = { ...updates.address };
    }
  }
}
