import type { UOM } from "../enums";

export interface InventoryItemProps {
  id?: string;
  tenantId: string;
  name: string;
  sku: string;
  description?: string;
  uom: UOM;
  metadata?: Record<string, any>;
}

export class InventoryItem {
  private props: InventoryItemProps;

  constructor(props: InventoryItemProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get sku() { return this.props.sku; }
  get propsSnapshot() { return this.props; }
}
