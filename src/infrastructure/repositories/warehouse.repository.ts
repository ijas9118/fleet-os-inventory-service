import type { Warehouse, WarehouseProps } from "@/domain/entities";
import type { IWareHouseRepository } from "@/domain/repositories";

import { Warehouse as WarehouseEntity } from "@/domain/entities";
import { WarehouseStatus } from "@/domain/enums";

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

  async listWarehouses(tenantId: string): Promise<Warehouse[]> {
    const results = await WarehouseModel.find({
      tenantId,
      status: WarehouseStatus.ACTIVE,
    }).lean();

    return results.map(doc => this._mapToEntity(doc));
  }
}
