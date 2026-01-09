import { InsufficientStockError, ValidationError } from "../errors";

export interface StockProps {
  id?: string;
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Stock {
  private readonly _props: StockProps;

  constructor(props: StockProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: StockProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.warehouseId || props.warehouseId.trim() === "") {
      throw new ValidationError("Warehouse ID is required");
    }

    if (!props.inventoryItemId || props.inventoryItemId.trim() === "") {
      throw new ValidationError("Inventory Item ID is required");
    }

    if (props.quantity < 0) {
      throw new ValidationError("Quantity cannot be negative");
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

  get quantity(): number {
    return this._props.quantity;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get propsSnapshot(): StockProps {
    return { ...this._props };
  }

  // Business methods
  increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new ValidationError("Amount to increase must be positive");
    }

    this._props.quantity += amount;
    this._props.updatedAt = new Date();
  }

  decreaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new ValidationError("Amount to decrease must be positive");
    }

    if (this._props.quantity < amount) {
      throw new InsufficientStockError(this._props.quantity, amount);
    }

    this._props.quantity -= amount;
    this._props.updatedAt = new Date();
  }

  adjustQuantity(amount: number): void {
    const newQuantity = this._props.quantity + amount;

    if (newQuantity < 0) {
      throw new ValidationError(
        `Adjustment would result in negative quantity. Current: ${this._props.quantity}, Adjustment: ${amount}`,
      );
    }

    this._props.quantity = newQuantity;
    this._props.updatedAt = new Date();
  }
}
