import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import { InventoryItem } from "@/domain/entities";
import { InventoryItemStatus } from "@/domain/enums";
import { SkuAlreadyExistsError } from "@/domain/errors";

import type { CreateInventoryItemDTO } from "./create-inventory-item.dto";

export class CreateInventoryItemUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: CreateInventoryItemDTO): Promise<InventoryItem> {
    // Check if SKU already exists for this tenant
    const existing = await this._inventoryItemRepo.findBySku(dto.sku.toUpperCase(), dto.tenantId);

    if (existing) {
      throw new SkuAlreadyExistsError(dto.sku);
    }

    // Create new inventory item entity
    const inventoryItem = new InventoryItem({
      tenantId: dto.tenantId,
      sku: dto.sku.toUpperCase(),
      name: dto.name,
      description: dto.description,
      category: dto.category,
      unit: dto.unit,
      minStockLevel: dto.minStockLevel,
      maxStockLevel: dto.maxStockLevel,
      reorderPoint: dto.reorderPoint,
      status: InventoryItemStatus.ACTIVE,
    });

    // Persist to database
    const result = await this._inventoryItemRepo.create(inventoryItem);

    return result;
  }
}
