import { model, Schema } from "mongoose";

import { StockTransactionType } from "@/domain/enums";

const StockTransactionSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  warehouseId: {
    type: String,
    required: true,
    index: true,
  },
  inventoryItemId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(StockTransactionType),
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
  },
  referenceId: {
    type: String,
    index: true,
  },
  relatedTransactionId: {
    type: String,
    index: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Index for querying transactions by warehouse and date
StockTransactionSchema.index({ tenantId: 1, warehouseId: 1, createdAt: -1 });

// Index for querying transactions by item and date
StockTransactionSchema.index({ tenantId: 1, inventoryItemId: 1, createdAt: -1 });

// Index for querying transactions by type and date
StockTransactionSchema.index({ tenantId: 1, type: 1, createdAt: -1 });

export const StockTransactionModel = model("StockTransaction", StockTransactionSchema);
