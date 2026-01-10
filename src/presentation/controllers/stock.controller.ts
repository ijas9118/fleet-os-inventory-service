import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { AddStockUseCase } from "@/use-cases/stock/add-stock";
import type { AdjustStockUseCase } from "@/use-cases/stock/adjust-stock";
import type { CreateStockRecordUseCase } from "@/use-cases/stock/create-stock-record";
import type { GetStockUseCase } from "@/use-cases/stock/get-stock";
import type { GetWarehouseStockUseCase } from "@/use-cases/stock/get-warehouse-stock";
import type { ListStockUseCase } from "@/use-cases/stock/list-stock";
import type { RemoveStockUseCase } from "@/use-cases/stock/remove-stock";
import type { TransferStockUseCase } from "@/use-cases/stock/transfer-stock";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class StockController {
  constructor(
    private _createStockRecordUC: CreateStockRecordUseCase,
    private _listStockUC: ListStockUseCase,
    private _getStockUC: GetStockUseCase,
    private _getWarehouseStockUC: GetWarehouseStockUseCase,
    private _addStockUC: AddStockUseCase,
    private _removeStockUC: RemoveStockUseCase,
    private _adjustStockUC: AdjustStockUseCase,
    private _transferStockUC: TransferStockUseCase,
  ) {}

  createStockRecord = asyncHandler(async (req: Request, res: Response) => {
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

    const stock = await this._createStockRecordUC.execute(dto);

    ResponseHelper.created(res, "Stock record created successfully", {
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      inventoryItemId: stock.inventoryItemId,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    });
  });

  listStock = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const { page, limit } = RequestHelper.parsePaginationParams(req.query);
    const warehouseId = req.query.warehouseId as string | undefined;
    const inventoryItemId = req.query.inventoryItemId as string | undefined;

    const result = await this._listStockUC.execute({
      tenantId,
      page,
      limit,
      warehouseId,
      inventoryItemId,
    });

    const formattedItems = result.data.map(stock => ({
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }));

    ResponseHelper.success(res, "Stock records retrieved successfully", {
      data: formattedItems,
      meta: result.meta,
    });
  });

  getStock = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const stock = await this._getStockUC.execute({
      id,
      tenantId,
    });

    ResponseHelper.success(res, "Stock record retrieved successfully", {
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    });
  });

  getWarehouseStock = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { warehouseId } = req.params;
    const { page, limit } = RequestHelper.parsePaginationParams(req.query);

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const result = await this._getWarehouseStockUC.execute({
      warehouseId,
      tenantId,
      page,
      limit,
    });

    const formattedItems = result.data.map(stock => ({
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }));

    ResponseHelper.success(res, "Warehouse stock retrieved successfully", {
      data: formattedItems,
      meta: result.meta,
    });
  });

  addStock = asyncHandler(async (req: Request, res: Response) => {
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

    const stock = await this._addStockUC.execute(dto);

    ResponseHelper.success(res, "Stock added successfully", {
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    });
  });

  removeStock = asyncHandler(async (req: Request, res: Response) => {
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

    const stock = await this._removeStockUC.execute(dto);

    ResponseHelper.success(res, "Stock removed successfully", {
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    });
  });

  adjustStock = asyncHandler(async (req: Request, res: Response) => {
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

    const stock = await this._adjustStockUC.execute(dto);

    ResponseHelper.success(res, "Stock adjusted successfully", {
      id: stock.id,
      tenantId: stock.tenantId,
      warehouseId: stock.warehouseId,
      warehouse: stock.warehouse,
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    });
  });

  transferStock = asyncHandler(async (req: Request, res: Response) => {
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

    const result = await this._transferStockUC.execute(dto);

    ResponseHelper.success(res, "Stock transferred successfully", {
      source: {
        id: result.source.id,
        warehouseId: result.source.warehouseId,
        quantity: result.source.quantity,
      },
      destination: {
        id: result.destination.id,
        warehouseId: result.destination.warehouseId,
        quantity: result.destination.quantity,
      },
    });
  });
}
