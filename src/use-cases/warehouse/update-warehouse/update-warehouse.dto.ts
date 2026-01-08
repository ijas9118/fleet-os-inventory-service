export interface UpdateWarehouseDTO {
  warehouseId: string;
  tenantId: string;
  name: string;
  code: string;
  address: {
    line1: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}
