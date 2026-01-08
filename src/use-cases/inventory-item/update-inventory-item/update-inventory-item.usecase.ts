import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import { InventoryItemNotFoundError } from "@/domain/errors";

import type { UpdateInventoryItemDTO } from "./update-inventory-item.dto";

export class UpdateInventoryItemUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: UpdateInventoryItemDTO): Promise<void> {
    // Find item and verify tenant ownership
    const item = await this._inventoryItemRepo.findById(dto.itemId, dto.tenantId);

    if (!item) {
      throw new InventoryItemNotFoundError(dto.itemId);
    }

    // Update item details using entity method
    item.updateDetails({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      unit: dto.unit,
      minStockLevel: dto.minStockLevel,
      maxStockLevel: dto.maxStockLevel,
      reorderPoint: dto.reorderPoint,
    });

    // Persist changes
    await this._inventoryItemRepo.update(dto.itemId, item.propsSnapshot);
  }
}
