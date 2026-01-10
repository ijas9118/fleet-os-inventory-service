import { Types } from "mongoose";

import type { StockResponseDTO } from "@/domain/dtos";
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

  private _mapToDTO(doc: any): StockResponseDTO {
    return {
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      warehouseId: doc.warehouseId.toString(),
      warehouse: {
        id: doc.warehouse?._id?.toString() || doc.warehouseId.toString(),
        name: doc.warehouse?.name || "Unknown",
        code: doc.warehouse?.code || "N/A",
        status: doc.warehouse?.status || "unknown",
      },
      inventoryItemId: doc.inventoryItemId.toString(),
      inventoryItem: {
        id: doc.inventoryItem?._id?.toString() || doc.inventoryItemId.toString(),
        sku: doc.inventoryItem?.sku || "Unknown",
        name: doc.inventoryItem?.name || "Unknown",
        category: doc.inventoryItem?.category,
        unit: doc.inventoryItem?.unit || "unit",
      },
      quantity: doc.quantity,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private _buildLookupPipeline(matchStage: any): any[] {
    return [
      { $match: matchStage },
      // Convert string IDs to ObjectIds for lookup
      {
        $addFields: {
          warehouseObjectId: { $toObjectId: "$warehouseId" },
          inventoryItemObjectId: { $toObjectId: "$inventoryItemId" },
        },
      },
      // Lookup warehouse using the ObjectId
      {
        $lookup: {
          from: "warehouses",
          localField: "warehouseObjectId",
          foreignField: "_id",
          as: "warehouse",
        },
      },
      { $unwind: { path: "$warehouse", preserveNullAndEmptyArrays: true } },
      // Lookup inventory item using the ObjectId
      {
        $lookup: {
          from: "inventoryitems",
          localField: "inventoryItemObjectId",
          foreignField: "_id",
          as: "inventoryItem",
        },
      },
      { $unwind: { path: "$inventoryItem", preserveNullAndEmptyArrays: true } },
      // Remove temporary ObjectId fields
      {
        $project: {
          warehouseObjectId: 0,
          inventoryItemObjectId: 0,
        },
      },
    ];
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

  async findById(id: string, tenantId: string): Promise<StockResponseDTO | null> {
    const pipeline = this._buildLookupPipeline({ _id: new Types.ObjectId(id), tenantId });

    const [doc] = await StockModel.aggregate(pipeline);

    if (!doc) {
      return null;
    }

    return this._mapToDTO(doc);
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
  ): Promise<{ items: StockResponseDTO[]; total: number }> {
    const { page, limit } = options;
    const query = { tenantId, warehouseId };

    const skip = (page - 1) * limit;

    const pipeline = [
      ...this._buildLookupPipeline(query),
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [docs, total] = await Promise.all([
      StockModel.aggregate(pipeline),
      StockModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToDTO(doc));

    return { items, total };
  }

  async findByItem(inventoryItemId: string, tenantId: string): Promise<StockResponseDTO[]> {
    const pipeline = [
      ...this._buildLookupPipeline({ tenantId, inventoryItemId }),
      { $sort: { createdAt: -1 } },
    ];

    const docs = await StockModel.aggregate(pipeline);

    return docs.map(doc => this._mapToDTO(doc));
  }

  async list(options: ListStockOptions): Promise<{ items: StockResponseDTO[]; total: number }> {
    const { tenantId, page, limit, warehouseId, inventoryItemId } = options;

    // Build query
    const query: any = { tenantId };

    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    if (inventoryItemId) {
      query.inventoryItemId = inventoryItemId;
    }

    // Execute query with aggregation
    const skip = (page - 1) * limit;

    const pipeline = [
      ...this._buildLookupPipeline(query),
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [docs, total] = await Promise.all([
      StockModel.aggregate(pipeline),
      StockModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToDTO(doc));

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
