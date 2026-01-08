import type { InventoryItem } from "@/domain/entities";
import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import type { ListInventoryItemsDTO } from "./list-inventory-items.dto";

export class ListInventoryItemsUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: ListInventoryItemsDTO): Promise<{
    items: InventoryItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { items, total } = await this._inventoryItemRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      search: dto.search,
      category: dto.category,
      status: dto.status,
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      items,
      total,
      page: dto.page,
      totalPages,
    };
  }
}
