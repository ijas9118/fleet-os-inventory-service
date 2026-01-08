export interface ListInventoryItemsDTO {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
}
