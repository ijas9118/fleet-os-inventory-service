import type { Warehouse, WarehouseProps } from "@/domain/entities";
import type { IWareHouseRepository, ListWarehousesOptions } from "@/domain/repositories";

import { Warehouse as WarehouseEntity } from "@/domain/entities";

import { WarehouseModel } from "../models/warehouse.model";

export class WarehouseRepository implements IWareHouseRepository {
  private _mapToEntity(doc: any): WarehouseEntity {
    return new WarehouseEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      name: doc.name,
      code: doc.code,
      address: {
        line1: doc.address.line1,
        city: doc.address.city,
        state: doc.address.state ?? undefined,
        postalCode: doc.address.postalCode ?? undefined,
        country: doc.address.country,
        coordinates: (doc.address.coordinates && doc.address.coordinates.coordinates)
          ? {
              lat: doc.address.coordinates.coordinates[1],
              lng: doc.address.coordinates.coordinates[0],
            }
          : undefined,
      },
      status: doc.status,
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async createWarehouse(props: WarehouseProps): Promise<Warehouse> {
    const address = props.address;
    const formattedAddress: any = {
      line1: address.line1,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      coordinates: {
        type: "Point",
        coordinates: [address.coordinates!.lng, address.coordinates!.lat],
      },
    };

    const created = await WarehouseModel.create({
      tenantId: props.tenantId,
      name: props.name,
      code: props.code,
      address: formattedAddress,
      status: props.status,
    });

    return new WarehouseEntity({
      ...props,
      id: created._id.toString(),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findByCode(code: string, tenantId: string): Promise<Warehouse | null> {
    const found = await WarehouseModel.findOne({ code, tenantId }).lean();

    if (!found)
      return null;

    return this._mapToEntity(found);
  }

  async listWarehouses(options: ListWarehousesOptions): Promise<{ warehouses: Warehouse[]; total: number }> {
    const { tenantId, page, limit, search, status, includeArchived } = options;

    // Build query - exclude archived warehouses by default unless includeArchived is true
    const query: any = { tenantId };

    if (!includeArchived) {
      query.deletedAt = null;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.country": { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [warehouses, total] = await Promise.all([
      WarehouseModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WarehouseModel.countDocuments(query),
    ]);

    return {
      warehouses: warehouses.map(doc => this._mapToEntity(doc)),
      total,
    };
  }

  async findById(warehouseId: string, tenantId: string): Promise<Warehouse | null> {
    const found = await WarehouseModel.findOne({ _id: warehouseId, tenantId }).lean();

    if (!found)
      return null;

    return this._mapToEntity(found);
  }

  async updateWarehouse(warehouseId: string, updates: Partial<WarehouseProps>): Promise<Warehouse> {
    // Transform address coordinates to GeoJSON format if address is being updated
    const mongoUpdates: any = { ...updates };

    if (updates.address) {
      mongoUpdates.address = {
        line1: updates.address.line1,
        city: updates.address.city,
        state: updates.address.state,
        postalCode: updates.address.postalCode,
        country: updates.address.country,
        coordinates: updates.address.coordinates
          ? {
              type: "Point",
              coordinates: [updates.address.coordinates.lng, updates.address.coordinates.lat],
            }
          : undefined,
      };
    }

    const updated = await WarehouseModel.findByIdAndUpdate(
      warehouseId,
      { $set: mongoUpdates },
      { new: true },
    ).lean();

    if (!updated) {
      throw new Error("Warehouse not found");
    }

    return this._mapToEntity(updated);
  }
}
