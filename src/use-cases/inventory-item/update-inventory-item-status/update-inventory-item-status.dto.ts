export interface UpdateInventoryItemStatusDTO {
  itemId: string;
  tenantId: string;
  status: "ACTIVE" | "DISCONTINUED";
}
