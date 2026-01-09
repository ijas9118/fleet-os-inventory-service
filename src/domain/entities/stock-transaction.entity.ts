import type { StockTransactionType } from "../enums";

import { ValidationError } from "../errors";

export interface StockTransactionProps {
  id?: string;
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  type: StockTransactionType;
  quantity: number;
  notes?: string;
  referenceId?: string;
  relatedTransactionId?: string;
  createdAt?: Date;
}

export class StockTransaction {
  private readonly _props: StockTransactionProps;

  constructor(props: StockTransactionProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: StockTransactionProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.warehouseId || props.warehouseId.trim() === "") {
      throw new ValidationError("Warehouse ID is required");
    }

    if (!props.inventoryItemId || props.inventoryItemId.trim() === "") {
      throw new ValidationError("Inventory Item ID is required");
    }

    if (!props.type) {
      throw new ValidationError("Transaction type is required");
    }

    if (props.quantity <= 0) {
      throw new ValidationError("Quantity must be positive");
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

  get inventoryItemId(): string {
    return this._props.inventoryItemId;
  }

  get type(): StockTransactionType {
    return this._props.type;
  }

  get quantity(): number {
    return this._props.quantity;
  }

  get notes(): string | undefined {
    return this._props.notes;
  }

  get referenceId(): string | undefined {
    return this._props.referenceId;
  }

  get relatedTransactionId(): string | undefined {
    return this._props.relatedTransactionId;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get propsSnapshot(): StockTransactionProps {
    return { ...this._props };
  }
}
