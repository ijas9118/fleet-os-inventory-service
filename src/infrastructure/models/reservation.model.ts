import { model, Schema } from "mongoose";

import { ReservationStatus } from "@/domain/enums";

// Reservation item subdocument schema
const ReservationItemSchema = new Schema({
  inventoryItemId: {
    type: String,
    required: true,
  },
  stockId: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

// Main reservation schema
const ReservationSchema = new Schema({
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
  shipmentId: {
    type: String,
    index: true,
  },
  items: {
    type: [ReservationItemSchema],
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.RESERVED,
    index: true,
  },
  reservedAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true, // For cleanup queries
  },
  releasedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for tenant queries
ReservationSchema.index({ tenantId: 1, status: 1 });

// Index for shipment lookups
ReservationSchema.index({ shipmentId: 1 });

// Index for expiry cleanup job
ReservationSchema.index({ status: 1, expiresAt: 1 });

export const ReservationModel = model("Reservation", ReservationSchema);
