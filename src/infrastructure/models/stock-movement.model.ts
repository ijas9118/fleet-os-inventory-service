import { model, Schema } from "mongoose";

import { StockMovementType } from "@/domain/enums";

const StockMovementSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  warehouseId: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  inventoryItemId: {
    type: Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  movementType: {
    type: String,
    enum: Object.values(StockMovementType),
    required: true,
  },
  relatedReservationId: {
    type: Schema.Types.ObjectId,
    ref: "InventoryReservation",
  },
  referenceShipmentId: {
    type: Schema.Types.ObjectId,
    ref: "Shipment",
  },
  notes: String,
  createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  indexes: [
    { tenantId: 1, warehouseId: 1, inventoryItemId: 1 },
    { tenantId: 1, movementType: 1, createdAt: -1 },
  ],
});

export const StockMovementModel = model("StockMovement", StockMovementSchema);
