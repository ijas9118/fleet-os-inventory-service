import type { Request, Response } from "express";

import type { ReleaseReservationUseCase } from "@/use-cases/reservation/release-reservation";
import type { ReserveStockUseCase } from "@/use-cases/reservation/reserve-stock";

import { asyncHandler } from "../utils/async-handler";
import { ResponseHelper } from "../utils/response.helper";

export class ReservationController {
  constructor(
    private _reserveStockUC: ReserveStockUseCase,
    private _releaseReservationUC: ReleaseReservationUseCase,
  ) {}

  reserveStock = asyncHandler(async (req: Request, res: Response) => {
    // This is an internal endpoint - tenantId comes from request body
    const result = await this._reserveStockUC.execute(req.body);

    ResponseHelper.created(res, "Stock reserved successfully", result);
  });

  releaseReservation = asyncHandler(async (req: Request, res: Response) => {
    // This is an internal endpoint - tenantId comes from request body
    await this._releaseReservationUC.execute(req.body);

    ResponseHelper.success(res, "Reservation released successfully");
  });
}
