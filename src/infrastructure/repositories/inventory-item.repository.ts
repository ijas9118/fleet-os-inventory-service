import type { InventoryItem, InventoryItemProps } from "@/domain/entities";
import type { IInventoryItemRepository, ListInventoryItemsOptions } from "@/domain/repositories";

import { InventoryItem as InventoryItemEntity } from "@/domain/entities";

import { InventoryItemModel } from "../models/inventory-item.model";

export class InventoryItemRepository implements IInventoryItemRepository {
  private _mapToEntity(doc: any): InventoryItemEntity {
    return new InventoryItemEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      sku: doc.sku,
      name: doc.name,
      description: doc.description ?? undefined,
      category: doc.category ?? undefined,
      unit: doc.unit,
      minStockLevel: doc.minStockLevel ?? undefined,
      maxStockLevel: doc.maxStockLevel ?? undefined,
      reorderPoint: doc.reorderPoint ?? undefined,
      status: doc.status,
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(item: InventoryItem): Promise<InventoryItem> {
    const props = item.propsSnapshot;

    const created = await InventoryItemModel.create({
      tenantId: props.tenantId,
      sku: props.sku,
      name: props.name,
      description: props.description,
      category: props.category,
      unit: props.unit,
      minStockLevel: props.minStockLevel,
      maxStockLevel: props.maxStockLevel,
      reorderPoint: props.reorderPoint,
      status: props.status,
    });

    return this._mapToEntity(created);
  }

  async findById(id: string, tenantId: string): Promise<InventoryItem | null> {
    const doc = await InventoryItemModel.findOne({ _id: id, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findBySku(sku: string, tenantId: string): Promise<InventoryItem | null> {
    const doc = await InventoryItemModel.findOne({ sku, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async list(options: ListInventoryItemsOptions): Promise<{ items: InventoryItem[]; total: number }> {
    const { tenantId, page, limit, search, category, status, includeArchived } = options;

    // Build query
    const query: any = { tenantId };

    // Filter out archived items by default (only show if explicitly requested)
    if (!includeArchived) {
      query.deletedAt = null;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      InventoryItemModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      InventoryItemModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToEntity(doc));

    return { items, total };
  }

  async update(id: string, updates: Partial<InventoryItemProps>): Promise<void> {
    const updateData: any = {};

    if (updates.name !== undefined)
      updateData.name = updates.name;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.category !== undefined)
      updateData.category = updates.category;
    if (updates.unit !== undefined)
      updateData.unit = updates.unit;
    if (updates.minStockLevel !== undefined)
      updateData.minStockLevel = updates.minStockLevel;
    if (updates.maxStockLevel !== undefined)
      updateData.maxStockLevel = updates.maxStockLevel;
    if (updates.reorderPoint !== undefined)
      updateData.reorderPoint = updates.reorderPoint;
    if (updates.status !== undefined)
      updateData.status = updates.status;
    if (updates.deletedAt !== undefined)
      updateData.deletedAt = updates.deletedAt;
    if (updates.updatedAt !== undefined)
      updateData.updatedAt = updates.updatedAt;

    await InventoryItemModel.updateOne({ _id: id }, { $set: updateData });
  }

  async archive(id: string): Promise<void> {
    await InventoryItemModel.updateOne(
      { _id: id },
      {
        $set: {
          status: "ARCHIVED",
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  }
}
