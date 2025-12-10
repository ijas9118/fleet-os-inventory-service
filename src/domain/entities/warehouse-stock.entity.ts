export interface WarehouseStockProps {
  tenantId: string;
  warehouseId: string;
  inventoryItemId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export class WarehouseStock {
  private props: WarehouseStockProps;

  constructor(props: WarehouseStockProps) {
    this.props = props;
  }

  get tenantId() { return this.props.tenantId; }
  get warehouseId() { return this.props.warehouseId; }
  get inventoryItemId() { return this.props.inventoryItemId; }
  get availableQuantity() { return this.props.availableQuantity; }
  get reservedQuantity() { return this.props.reservedQuantity; }
  get totalQuantity() { return this.props.quantity; }
}
