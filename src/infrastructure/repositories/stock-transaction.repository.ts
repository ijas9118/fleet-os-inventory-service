import { Types } from "mongoose";

import type { StockTransactionResponseDTO } from "@/domain/dtos";
import type { StockTransaction } from "@/domain/entities";
import type { IStockTransactionRepository, ListStockTransactionsOptions } from "@/domain/repositories";

import { StockTransaction as StockTransactionEntity } from "@/domain/entities";

import { StockTransactionModel } from "../models/stock-transaction.model";

export class StockTransactionRepository implements IStockTransactionRepository {
  private _mapToEntity(doc: any): StockTransactionEntity {
    return new StockTransactionEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      warehouseId: doc.warehouseId.toString(),
      inventoryItemId: doc.inventoryItemId.toString(),
      type: doc.type,
      quantity: doc.quantity,
      notes: doc.notes ?? undefined,
      referenceId: doc.referenceId ?? undefined,
      relatedTransactionId: doc.relatedTransactionId ?? undefined,
      createdAt: doc.createdAt,
    });
  }

  private _mapToDTO(doc: any): StockTransactionResponseDTO {
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
      type: doc.type,
      quantity: doc.quantity,
      notes: doc.notes,
      referenceId: doc.referenceId,
      relatedTransactionId: doc.relatedTransactionId,
      createdAt: doc.createdAt,
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

  async create(transaction: StockTransaction): Promise<StockTransaction> {
    const props = transaction.propsSnapshot;

    const created = await StockTransactionModel.create({
      tenantId: props.tenantId,
      warehouseId: props.warehouseId,
      inventoryItemId: props.inventoryItemId,
      type: props.type,
      quantity: props.quantity,
      notes: props.notes,
      referenceId: props.referenceId,
      relatedTransactionId: props.relatedTransactionId,
    });

    return this._mapToEntity(created);
  }

  async findById(id: string, tenantId: string): Promise<StockTransactionResponseDTO | null> {
    const pipeline = this._buildLookupPipeline({ _id: new Types.ObjectId(id), tenantId });

    const [doc] = await StockTransactionModel.aggregate(pipeline);

    if (!doc) {
      return null;
    }

    return this._mapToDTO(doc);
  }

  async findByReference(referenceId: string, tenantId: string): Promise<StockTransactionResponseDTO[]> {
    const pipeline = [
      ...this._buildLookupPipeline({ tenantId, referenceId }),
      { $sort: { createdAt: -1 } },
    ];

    const docs = await StockTransactionModel.aggregate(pipeline);

    return docs.map(doc => this._mapToDTO(doc));
  }

  async list(options: ListStockTransactionsOptions): Promise<{ items: StockTransactionResponseDTO[]; total: number }> {
    const { tenantId, page, limit, warehouseId, inventoryItemId, type, startDate, endDate } = options;

    // Build query
    const query: any = { tenantId };

    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    if (inventoryItemId) {
      query.inventoryItemId = inventoryItemId;
    }

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = startDate;
      }
      if (endDate) {
        query.createdAt.$lte = endDate;
      }
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
      StockTransactionModel.aggregate(pipeline),
      StockTransactionModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToDTO(doc));

    return { items, total };
  }
}
