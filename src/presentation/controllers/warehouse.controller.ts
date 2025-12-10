import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";
import type { ListWarehousesUseCase } from "@/use-cases/list-warehouses/list-warehouses.usecase";

import { asyncHandler } from "../utils/async-handler";

export class WarehouseController {
  constructor(
    private _createWarehouseUC: CreateWarehouseUseCase,
    private _listWarehousesUC: ListWarehousesUseCase,
  ) {}

  createWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const dto = { ...req.body };
    const warehouse = await this._createWarehouseUC.execute(dto);

    res.status(STATUS_CODES.CREATED).json({ success: true, data: warehouse.propsSnapshot });
  });

  listWarehouses = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;

    const warehousesList = await this._listWarehousesUC.execute(tenantId);
    res.status(STATUS_CODES.OK).json({ success: true, data: warehousesList });
  });
}
