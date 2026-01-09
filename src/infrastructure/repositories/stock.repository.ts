import type { Stock, StockProps } from "@/domain/entities";
import type { IStockRepository, ListStockOptions } from "@/domain/repositories";

import { Stock as StockEntity } from "@/domain/entities";

import { StockModel } from "../models/stock.model";

export class StockRepository implements IStockRepository {
  private _mapToEntity(doc: any): StockEntity {
    return new StockEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      warehouseId: doc.warehouseId.toString(),
      inventoryItemId: doc.inventoryItemId.toString(),
      quantity: doc.quantity,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(stock: Stock): Promise<Stock> {
    const props = stock.propsSnapshot;

    const created = await StockModel.create({
      tenantId: props.tenantId,
      warehouseId: props.warehouseId,
      inventoryItemId: props.inventoryItemId,
      quantity: props.quantity,
    });

    return this._mapToEntity(created);
  }

  async findById(id: string, tenantId: string): Promise<Stock | null> {
    const doc = await StockModel.findOne({ _id: id, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findByWarehouseAndItem(
    warehouseId: string,
    inventoryItemId: string,
    tenantId: string,
  ): Promise<Stock | null> {
    const doc = await StockModel.findOne({
      tenantId,
      warehouseId,
      inventoryItemId,
    });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findByWarehouse(
    warehouseId: string,
    tenantId: string,
    options: { page: number; limit: number },
  ): Promise<{ items: Stock[]; total: number }> {
    const { page, limit } = options;
    const query = { tenantId, warehouseId };

    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      StockModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      StockModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToEntity(doc));

    return { items, total };
  }

  async findByItem(inventoryItemId: string, tenantId: string): Promise<Stock[]> {
    const docs = await StockModel.find({
      tenantId,
      inventoryItemId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map(doc => this._mapToEntity(doc));
  }

  async list(options: ListStockOptions): Promise<{ items: Stock[]; total: number }> {
    const { tenantId, page, limit, warehouseId, inventoryItemId } = options;

    // Build query
    const query: any = { tenantId };

    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    if (inventoryItemId) {
      query.inventoryItemId = inventoryItemId;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      StockModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      StockModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToEntity(doc));

    return { items, total };
  }

  async update(id: string, updates: Partial<StockProps>): Promise<void> {
    const updateData: any = {};

    if (updates.quantity !== undefined)
      updateData.quantity = updates.quantity;
    if (updates.updatedAt !== undefined)
      updateData.updatedAt = updates.updatedAt;

    await StockModel.updateOne({ _id: id }, { $set: updateData });
  }
}
