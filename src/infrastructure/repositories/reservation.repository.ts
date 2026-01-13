import type { Reservation, ReservationProps } from "@/domain/entities";
import type { IReservationRepository } from "@/domain/repositories";

import { Reservation as ReservationEntity } from "@/domain/entities";

import { ReservationModel } from "../models/reservation.model";

export class ReservationRepository implements IReservationRepository {
  private _mapToEntity(doc: any): ReservationEntity {
    return new ReservationEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId,
      warehouseId: doc.warehouseId,
      shipmentId: doc.shipmentId,
      items: doc.items.map((item: any) => ({
        inventoryItemId: item.inventoryItemId,
        stockId: item.stockId,
        sku: item.sku,
        quantity: item.quantity,
      })),
      status: doc.status,
      reservedAt: doc.reservedAt,
      expiresAt: doc.expiresAt,
      releasedAt: doc.releasedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(reservation: Reservation): Promise<Reservation> {
    const props = reservation.propsSnapshot;

    const created = await ReservationModel.create({
      tenantId: props.tenantId,
      warehouseId: props.warehouseId,
      shipmentId: props.shipmentId,
      items: props.items,
      status: props.status,
      reservedAt: props.reservedAt,
      expiresAt: props.expiresAt,
      releasedAt: props.releasedAt,
    });

    return this._mapToEntity(created);
  }

  async findById(id: string, tenantId: string): Promise<Reservation | null> {
    const doc = await ReservationModel.findOne({ _id: id, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findByShipmentId(shipmentId: string): Promise<Reservation | null> {
    const doc = await ReservationModel.findOne({ shipmentId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findExpired(): Promise<Reservation[]> {
    const now = new Date();
    const docs = await ReservationModel.find({
      status: "RESERVED",
      expiresAt: { $lt: now },
    });

    return docs.map(doc => this._mapToEntity(doc));
  }

  async update(id: string, updates: Partial<ReservationProps>): Promise<void> {
    const updateData: any = {};

    if (updates.status !== undefined)
      updateData.status = updates.status;
    if (updates.releasedAt !== undefined)
      updateData.releasedAt = updates.releasedAt;
    if (updates.updatedAt !== undefined)
      updateData.updatedAt = updates.updatedAt;

    await ReservationModel.updateOne({ _id: id }, { $set: updateData });
  }
}
