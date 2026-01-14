import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { ArchiveWarehouseUseCase } from "@/use-cases/warehouse/archive-warehouse";
import type { CreateWarehouseUseCase } from "@/use-cases/warehouse/create-warehouse";
import type { GetWarehouseUseCase } from "@/use-cases/warehouse/get-warehouse";
import type { ListWarehousesUseCase } from "@/use-cases/warehouse/list-warehouses";
import type { UpdateWarehouseUseCase } from "@/use-cases/warehouse/update-warehouse";
import type { UpdateWarehouseStatusUseCase } from "@/use-cases/warehouse/update-warehouse-status";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class WarehouseController {
  constructor(
    private _createWarehouseUC: CreateWarehouseUseCase,
    private _listWarehousesUC: ListWarehousesUseCase,
    private _getWarehouseUC: GetWarehouseUseCase,
    private _updateWarehouseUC: UpdateWarehouseUseCase,
    private _updateWarehouseStatusUC: UpdateWarehouseStatusUseCase,
    private _archiveWarehouseUC: ArchiveWarehouseUseCase,
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
    const includeArchived = req.query.includeArchived === "true";

    const result = await this._listWarehousesUC.execute({
      tenantId,
      page,
      limit,
      search,
      status,
      includeArchived,
    });

    ResponseHelper.success(res, "Warehouses retrieved successfully", result);
  });

  getWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const warehouse = await this._getWarehouseUC.execute({
      warehouseId: id,
      tenantId,
    });

    ResponseHelper.success(res, "Warehouse retrieved successfully", warehouse);
  });

  updateWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._updateWarehouseUC.execute({
      warehouseId: id,
      tenantId,
      ...req.body,
    });

    ResponseHelper.success(res, "Warehouse updated successfully");
  });

  updateWarehouseStatus = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._updateWarehouseStatusUC.execute({
      warehouseId: id,
      tenantId,
      status: req.body.status,
    });

    ResponseHelper.success(res, "Warehouse status updated successfully");
  });

  archiveWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._archiveWarehouseUC.execute({
      warehouseId: id,
      tenantId,
    });

    ResponseHelper.success(res, "Warehouse archived successfully");
  });
}
