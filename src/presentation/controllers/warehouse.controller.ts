import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";

import { asyncHandler } from "../utils/async-handler";

export class WarehouseController {
  constructor(
    private _createWarehouseUC: CreateWarehouseUseCase,
  ) {}

  createWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const dto = { ...req.body };
    const warehouse = await this._createWarehouseUC.execute(dto);

    res.status(STATUS_CODES.CREATED).json({ success: true, data: warehouse.propsSnapshot });
  });
}
