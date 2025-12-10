import type { Warehouse, WarehouseProps } from "@/domain/entities";
import type { IWareHouseRepository } from "@/domain/repositories";

import { Warehouse as WarehouseEntity } from "@/domain/entities";
import { WarehouseStatus } from "@/domain/enums";

import { WarehouseModel } from "../models/warehouse.model";

export class WarehouseRepository implements IWareHouseRepository {
  async createWarehouse(props: WarehouseProps): Promise<Warehouse> {
    const address = props.address;
    const formattedAddress: any = { ...address };

    if (address.coordinates) {
      formattedAddress.coordinates = {
        type: "Point",
        coordinates: [address.coordinates.lng, address.coordinates.lat],
      };
    }

    const created = await WarehouseModel.create({
      ...props,
      address: formattedAddress,
    });

    return new WarehouseEntity({
      ...props,
      id: created._id.toString(),
    });
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    const found = await WarehouseModel.findOne({ code }).lean();

    if (!found)
      return null;

    return new WarehouseEntity({
      id: found._id.toString(),
      tenantId: found.tenantId.toString(),
      name: found.name,
      code: found.code,
      address: {
        line1: found.address.line1,
        city: found.address.city,
        state: found.address.state ?? undefined,
        postalCode: found.address.postalCode ?? undefined,
        country: found.address.country,
        coordinates: found.address.coordinates
          ? {
              lat: found.address.coordinates.coordinates[1],
              lng: found.address.coordinates.coordinates[0],
            }
          : undefined,
      },
      assignedManagerUserId: found.assignedManagerUserId?.toString(),
      status: found.status,
    });
  }

  async listWarehouses(tenantId: string): Promise<Warehouse[]> {
    const results = await WarehouseModel.find({
      tenantId,
      status: WarehouseStatus.ACTIVE,
    });

    return results.map(found => new WarehouseEntity({
      id: found._id.toString(),
      tenantId: found.tenantId.toString(),
      name: found.name,
      code: found.code,
      status: found.status,
      assignedManagerUserId: found.assignedManagerUserId?.toString(),
      address: {
        line1: found.address.line1,
        city: found.address.city,
        state: found.address.state ?? undefined,
        postalCode: found.address.postalCode ?? undefined,
        country: found.address.country,
        coordinates: found.address.coordinates
          ? {
              lat: found.address.coordinates.coordinates[1],
              lng: found.address.coordinates.coordinates[0],
            }
          : undefined,
      },
    }));
  }
}
