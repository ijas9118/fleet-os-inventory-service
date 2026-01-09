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

  async findById(id: string, tenantId: string): Promise<StockTransaction | null> {
    const doc = await StockTransactionModel.findOne({ _id: id, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findByReference(referenceId: string, tenantId: string): Promise<StockTransaction[]> {
    const docs = await StockTransactionModel.find({
      tenantId,
      referenceId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map(doc => this._mapToEntity(doc));
  }

  async list(options: ListStockTransactionsOptions): Promise<{ items: StockTransaction[]; total: number }> {
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

    // Execute query
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      StockTransactionModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      StockTransactionModel.countDocuments(query),
    ]);

    const items = docs.map(doc => this._mapToEntity(doc));

    return { items, total };
  }
}
