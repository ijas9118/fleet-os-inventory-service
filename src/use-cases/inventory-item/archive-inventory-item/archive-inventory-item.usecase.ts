import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import { InventoryItemNotFoundError } from "@/domain/errors";

import type { ArchiveInventoryItemDTO } from "./archive-inventory-item.dto";

export class ArchiveInventoryItemUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: ArchiveInventoryItemDTO): Promise<void> {
    // Find item and verify tenant ownership
    const item = await this._inventoryItemRepo.findById(dto.itemId, dto.tenantId);

    if (!item) {
      throw new InventoryItemNotFoundError(dto.itemId);
    }

    // Archive the item (soft delete)
    item.archive();

    // Persist changes
    await this._inventoryItemRepo.archive(dto.itemId);
  }
}
