import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { GetStockTransactionUseCase } from "@/use-cases/stock-transaction/get-stock-transaction";
import type { ListStockTransactionsUseCase } from "@/use-cases/stock-transaction/list-stock-transactions";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class StockTransactionController {
  constructor(
    private _listStockTransactionsUC: ListStockTransactionsUseCase,
    private _getStockTransactionUC: GetStockTransactionUseCase,
  ) {}

  listStockTransactions = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const { page, limit } = RequestHelper.parsePaginationParams(req.query);
    const warehouseId = req.query.warehouseId as string | undefined;
    const inventoryItemId = req.query.inventoryItemId as string | undefined;
    const type = req.query.type as any;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await this._listStockTransactionsUC.execute({
      tenantId,
      page,
      limit,
      warehouseId,
      inventoryItemId,
      type,
      startDate,
      endDate,
    });

    const formattedItems = result.data.map(transaction => ({
      id: transaction.id,
      tenantId: transaction.tenantId,
      warehouseId: transaction.warehouseId,
      warehouse: transaction.warehouse,
      inventoryItemId: transaction.inventoryItemId,
      inventoryItem: transaction.inventoryItem,
      type: transaction.type,
      quantity: transaction.quantity,
      notes: transaction.notes,
      referenceId: transaction.referenceId,
      relatedTransactionId: transaction.relatedTransactionId,
      createdAt: transaction.createdAt,
    }));

    ResponseHelper.success(res, "Stock transactions retrieved successfully", {
      data: formattedItems,
      meta: result.meta,
    });
  });

  getStockTransaction = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const transaction = await this._getStockTransactionUC.execute({
      id,
      tenantId,
    });

    ResponseHelper.success(res, "Stock transaction retrieved successfully", {
      id: transaction.id,
      tenantId: transaction.tenantId,
      warehouseId: transaction.warehouseId,
      warehouse: transaction.warehouse,
      inventoryItemId: transaction.inventoryItemId,
      inventoryItem: transaction.inventoryItem,
      type: transaction.type,
      quantity: transaction.quantity,
      notes: transaction.notes,
      referenceId: transaction.referenceId,
      relatedTransactionId: transaction.relatedTransactionId,
      createdAt: transaction.createdAt,
    });
  });
}
