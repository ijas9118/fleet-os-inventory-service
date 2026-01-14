import { model, Schema } from "mongoose";

import { InventoryItemStatus } from "@/domain/enums";

const InventoryItemSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  unit: {
    type: String,
    required: true,
  },
  minStockLevel: {
    type: Number,
    min: 0,
  },
  maxStockLevel: {
    type: Number,
    min: 0,
  },
  reorderPoint: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: Object.values(InventoryItemStatus),
    default: InventoryItemStatus.ACTIVE,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound unique index: SKU must be unique per tenant
InventoryItemSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

// Index for filtering by status
InventoryItemSchema.index({ tenantId: 1, status: 1 });

// Index for filtering by category
InventoryItemSchema.index({ tenantId: 1, category: 1 });

// Text index for search functionality
InventoryItemSchema.index({ sku: "text", name: "text", description: "text" });

export const InventoryItemModel = model("InventoryItem", InventoryItemSchema);
