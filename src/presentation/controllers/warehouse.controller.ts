import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";
import type { ListWarehousesUseCase } from "@/use-cases/list-warehouses/list-warehouses.usecase";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class WarehouseController {
  constructor(
    private _createWarehouseUC: CreateWarehouseUseCase,
    private _listWarehousesUC: ListWarehousesUseCase,
  ) {}

  createWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const dto = {
      ...req.body,
      tenantId,
    };

    const warehouse = await this._createWarehouseUC.execute(dto);

    ResponseHelper.created(res, "Warehouse created successfully", {
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      status: warehouse.status,
      tenantId: warehouse.tenantId,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    });
  });

  listWarehouses = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const { page, limit, search, status } = RequestHelper.parsePaginationParams(req.query);

    const result = await this._listWarehousesUC.execute({
      tenantId,
      page,
      limit,
      search,
      status,
    });

    ResponseHelper.success(res, "Warehouses retrieved successfully", result);
  });
}
