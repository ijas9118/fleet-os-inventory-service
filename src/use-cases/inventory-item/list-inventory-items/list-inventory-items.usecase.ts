import type { IInventoryItemRepository } from "@/domain/repositories/inventory-item.repository.interface";

import type { ListInventoryItemsDTO } from "./list-inventory-items.dto";

export class ListInventoryItemsUseCase {
  constructor(
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: ListInventoryItemsDTO): Promise<{
    data: Array<{
      id: string;
      tenantId: string;
      sku: string;
      name: string;
      description?: string;
      category?: string;
      unit: string;
      minStockLevel?: number;
      maxStockLevel?: number;
      reorderPoint?: number;
      status: string;
      createdAt?: Date;
      updatedAt?: Date;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { items, total } = await this._inventoryItemRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      search: dto.search,
      category: dto.category,
      status: dto.status,
      includeArchived: dto.includeArchived,
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: items.map(item => ({
        id: item.id!,
        tenantId: item.tenantId,
        sku: item.sku,
        name: item.name,
        description: item.description,
        category: item.category,
        unit: item.unit,
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel,
        reorderPoint: item.reorderPoint,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages,
      },
    };
  }
}
