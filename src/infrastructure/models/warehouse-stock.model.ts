import { model, Schema } from "mongoose";

const WarehouseStockSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  warehouseId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  inventoryItemId: {
    type: Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
  indexes: [
    { tenantId: 1, warehouseId: 1, inventoryItemId: 1 },
    { tenantId: 1, inventoryItemId: 1 },
    { warehouseId: 1, availableQuantity: 1 },
  ],
});

export const WarehouseStockModel = model("WarehouseStock", WarehouseStockSchema);
