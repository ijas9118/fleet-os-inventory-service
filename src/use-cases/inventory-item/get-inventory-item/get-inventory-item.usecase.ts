import type { InventoryItem } from "@/domain/entities";
import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import { InventoryItemNotFoundError } from "@/domain/errors";

import type { GetInventoryItemDTO } from "./get-inventory-item.dto";

export class GetInventoryItemUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: GetInventoryItemDTO): Promise<InventoryItem> {
    const item = await this._inventoryItemRepo.findById(dto.itemId, dto.tenantId);

    if (!item) {
      throw new InventoryItemNotFoundError(dto.itemId);
    }

    return item;
  }
}
