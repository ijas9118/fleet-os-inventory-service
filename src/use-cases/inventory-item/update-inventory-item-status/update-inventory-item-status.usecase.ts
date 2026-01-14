import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import { InventoryItemNotFoundError } from "@/domain/errors";

import type { UpdateInventoryItemStatusDTO } from "./update-inventory-item-status.dto";

export class UpdateInventoryItemStatusUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: UpdateInventoryItemStatusDTO): Promise<void> {
    // Find item and verify tenant ownership
    const item = await this._inventoryItemRepo.findById(dto.itemId, dto.tenantId);

    if (!item) {
      throw new InventoryItemNotFoundError(dto.itemId);
    }

    // Update status using entity methods
    if (dto.status === "ACTIVE") {
      item.reactivate();
    }
    else {
      item.discontinue();
    }

    // Persist changes
    await this._inventoryItemRepo.update(dto.itemId, {
      status: item.status,
      updatedAt: item.updatedAt,
    });
  }
}
