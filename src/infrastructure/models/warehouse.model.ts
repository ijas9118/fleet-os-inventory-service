import { model, Schema } from "mongoose";

import { WarehouseStatus } from "@/domain/enums";

const AddressSchema = new Schema(
  {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number], // [lng, lat]
    },
  },
  { _id: false },
);

const WarehouseSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  }, // WH001
  address: {
    type: AddressSchema,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(WarehouseStatus),
    default: WarehouseStatus.ACTIVE,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound unique index: code must be unique per tenant
WarehouseSchema.index({ tenantId: 1, code: 1 }, { unique: true });

// Optional: Geospatial index for location-based queries
WarehouseSchema.index({ "address.coordinates": "2dsphere" });

export const WarehouseModel = model("Warehouse", WarehouseSchema);
