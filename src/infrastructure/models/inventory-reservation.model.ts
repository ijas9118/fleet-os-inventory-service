import { model, Schema } from "mongoose";

import { InventoryReservationStatus, UOM } from "@/domain/enums";

const ReservationItemSchema = new Schema({
  inventoryItemId: {
    type: Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
  },
  reservedQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  uom: {
    type: String,
    enum: Object.values(UOM),
    required: true,
  },
});

const InventoryReservationSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  shipmentId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  originWarehouseId: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  reservedByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [ReservationItemSchema],
  status: {
    type: String,
    enum: Object.values(InventoryReservationStatus),
    default: InventoryReservationStatus.PENDING,
    index: true,
  },
  expiresAt: Date,
  events: [{
    eventId: String,
    eventType: String,
    processedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
  indexes: [{ tenantId: 1, status: 1 }, { correlationId: 1 }, { shipmentId: 1 }],
});

export const InventoryReservationModel = model("InventoryReservation", InventoryReservationSchema);
