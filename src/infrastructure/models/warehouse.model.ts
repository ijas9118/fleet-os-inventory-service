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
    unique: true,
    index: true,
  }, // WH001
  address: {
    type: AddressSchema,
    required: true,
  },
  assignedManagerUserId: {
    type: String,
    ref: "User",
  },
  status: {
    type: String,
    enum: Object.values(WarehouseStatus),
    default: WarehouseStatus.ACTIVE,
  },
}, {
  timestamps: true,
});

export const WarehouseModel = model("Warehouse", WarehouseSchema);
