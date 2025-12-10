import { model, Schema } from "mongoose";

import { UOM } from "@/domain/enums";

const InventoryItemSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: String,
  uom: {
    type: String,
    enum: Object.values(UOM),
    required: true,
  },
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
});

export const InventoryItemModel = model("InventoryItem", InventoryItemSchema);
