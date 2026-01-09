import { model, Schema } from "mongoose";

const StockSchema = new Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound unique index: One stock record per warehouse + item combination per tenant
StockSchema.index({ tenantId: 1, warehouseId: 1, inventoryItemId: 1 }, { unique: true });

// Index for querying stock by warehouse
StockSchema.index({ tenantId: 1, warehouseId: 1 });

// Index for querying stock by item
StockSchema.index({ tenantId: 1, inventoryItemId: 1 });

export const StockModel = model("Stock", StockSchema);
