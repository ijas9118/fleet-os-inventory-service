import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { ArchiveInventoryItemUseCase } from "@/use-cases/inventory-item/archive-inventory-item";
import type { CreateInventoryItemUseCase } from "@/use-cases/inventory-item/create-inventory-item";
import type { GetInventoryItemUseCase } from "@/use-cases/inventory-item/get-inventory-item";
import type { ListInventoryItemsUseCase } from "@/use-cases/inventory-item/list-inventory-items";
import type { UpdateInventoryItemUseCase } from "@/use-cases/inventory-item/update-inventory-item";
import type { UpdateInventoryItemStatusUseCase } from "@/use-cases/inventory-item/update-inventory-item-status";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class InventoryItemController {
  constructor(
    private _createInventoryItemUC: CreateInventoryItemUseCase,
    private _listInventoryItemsUC: ListInventoryItemsUseCase,
    private _getInventoryItemUC: GetInventoryItemUseCase,
    private _updateInventoryItemUC: UpdateInventoryItemUseCase,
    private _updateInventoryItemStatusUC: UpdateInventoryItemStatusUseCase,
    private _archiveInventoryItemUC: ArchiveInventoryItemUseCase,
  ) {}

  createInventoryItem = asyncHandler(async (req: Request, res: Response) => {
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

    const item = await this._createInventoryItemUC.execute(dto);

    ResponseHelper.created(res, "Inventory item created successfully", {
      id: item.id,
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      unit: item.unit,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      reorderPoint: item.reorderPoint,
      status: item.status,
      tenantId: item.tenantId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  });

  listInventoryItems = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const { page, limit, search, status } = RequestHelper.parsePaginationParams(req.query);
    const category = req.query.category as string | undefined;
    const includeArchived = req.query.includeArchived === "true";

    const result = await this._listInventoryItemsUC.execute({
      tenantId,
      page,
      limit,
      search,
      status,
      category,
      includeArchived,
    });

    ResponseHelper.success(res, "Inventory items retrieved successfully", result);
  });

  getInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const item = await this._getInventoryItemUC.execute({
      itemId: id,
      tenantId,
    });

    ResponseHelper.success(res, "Inventory item retrieved successfully", {
      id: item.id,
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      unit: item.unit,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      reorderPoint: item.reorderPoint,
      status: item.status,
      tenantId: item.tenantId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  });

  updateInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const dto = {
      ...req.body,
      itemId: id,
      tenantId,
    };

    await this._updateInventoryItemUC.execute(dto);

    ResponseHelper.success(res, "Inventory item updated successfully");
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { status } = req.body;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._updateInventoryItemStatusUC.execute({
      itemId: id,
      tenantId,
      status,
    });

    ResponseHelper.success(res, "Inventory item status updated successfully");
  });

  archiveInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._archiveInventoryItemUC.execute({
      itemId: id,
      tenantId,
    });

    ResponseHelper.success(res, "Inventory item archived successfully");
  });
}
