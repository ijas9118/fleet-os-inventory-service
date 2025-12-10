import type { WarehouseStatus } from "../enums";

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
  assignedManagerUserId?: string;
  status: WarehouseStatus;
}

export class Warehouse {
  private props: WarehouseProps;

  constructor(props: WarehouseProps) {
    this.props = {
      ...props,
      code: props.code.trim().toUpperCase(),
    };
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get code() { return this.props.code; }
  get status() { return this.props.status; }
  get propsSnapshot() { return this.props; }
}
