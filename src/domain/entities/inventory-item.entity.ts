import type { InventoryItemStatus } from "../enums";

import { ValidationError } from "../errors";

export interface InventoryItemProps {
  id?: string;
  tenantId: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  status: InventoryItemStatus;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InventoryItem {
  private readonly _props: InventoryItemProps;

  constructor(props: InventoryItemProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: InventoryItemProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.sku || props.sku.trim() === "") {
      throw new ValidationError("SKU is required");
    }

    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Item name is required");
    }

    if (!props.unit || props.unit.trim() === "") {
      throw new ValidationError("Unit of measurement is required");
    }

    // Validate stock levels if provided
    if (props.minStockLevel !== undefined && props.minStockLevel < 0) {
      throw new ValidationError("Minimum stock level cannot be negative");
    }

    if (props.maxStockLevel !== undefined && props.maxStockLevel < 0) {
      throw new ValidationError("Maximum stock level cannot be negative");
    }

    if (
      props.minStockLevel !== undefined
      && props.maxStockLevel !== undefined
      && props.minStockLevel > props.maxStockLevel
    ) {
      throw new ValidationError("Minimum stock level cannot exceed maximum stock level");
    }

    if (props.reorderPoint !== undefined && props.reorderPoint < 0) {
      throw new ValidationError("Reorder point cannot be negative");
    }
  }

  // Getters
  get id(): string | undefined {
    return this._props.id;
  }

  get tenantId(): string {
    return this._props.tenantId;
  }

  get sku(): string {
    return this._props.sku;
  }

  get name(): string {
    return this._props.name;
  }

  get description(): string | undefined {
    return this._props.description;
  }

  get category(): string | undefined {
    return this._props.category;
  }

  get unit(): string {
    return this._props.unit;
  }

  get minStockLevel(): number | undefined {
    return this._props.minStockLevel;
  }

  get maxStockLevel(): number | undefined {
    return this._props.maxStockLevel;
  }

  get reorderPoint(): number | undefined {
    return this._props.reorderPoint;
  }

  get status(): InventoryItemStatus {
    return this._props.status;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this._props.deletedAt;
  }

  get propsSnapshot(): InventoryItemProps {
    return { ...this._props };
  }

  // Business methods
  discontinue(): void {
    this._props.status = "DISCONTINUED" as InventoryItemStatus;
    this._props.updatedAt = new Date();
  }

  reactivate(): void {
    this._props.status = "ACTIVE" as InventoryItemStatus;
    this._props.updatedAt = new Date();
  }

  archive(): void {
    this._props.status = "ARCHIVED" as InventoryItemStatus;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }

  updateDetails(updates: {
    name?: string;
    description?: string;
    category?: string;
    unit?: string;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint?: number;
  }): void {
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim() === "") {
        throw new ValidationError("Item name cannot be empty");
      }
      this._props.name = updates.name;
    }

    if (updates.description !== undefined) {
      this._props.description = updates.description;
    }

    if (updates.category !== undefined) {
      this._props.category = updates.category;
    }

    if (updates.unit !== undefined) {
      if (!updates.unit || updates.unit.trim() === "") {
        throw new ValidationError("Unit of measurement cannot be empty");
      }
      this._props.unit = updates.unit;
    }

    if (updates.minStockLevel !== undefined) {
      if (updates.minStockLevel < 0) {
        throw new ValidationError("Minimum stock level cannot be negative");
      }
      this._props.minStockLevel = updates.minStockLevel;
    }

    if (updates.maxStockLevel !== undefined) {
      if (updates.maxStockLevel < 0) {
        throw new ValidationError("Maximum stock level cannot be negative");
      }
      this._props.maxStockLevel = updates.maxStockLevel;
    }

    if (updates.reorderPoint !== undefined) {
      if (updates.reorderPoint < 0) {
        throw new ValidationError("Reorder point cannot be negative");
      }
      this._props.reorderPoint = updates.reorderPoint;
    }

    // Validate min/max relationship if both are set
    if (
      this._props.minStockLevel !== undefined
      && this._props.maxStockLevel !== undefined
      && this._props.minStockLevel > this._props.maxStockLevel
    ) {
      throw new ValidationError("Minimum stock level cannot exceed maximum stock level");
    }

    this._props.updatedAt = new Date();
  }
}
