import type { Stock } from "@/domain/entities";
import type { IStockRepository } from "@/domain/repositories";

import { StockNotFoundError } from "@/domain/errors";

import type { GetStockDTO } from "./get-stock.dto";

export class GetStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: GetStockDTO): Promise<Stock> {
    const stock = await this._stockRepo.findById(dto.id, dto.tenantId);

    if (!stock) {
      throw new StockNotFoundError(dto.id);
    }

    return stock;
  }
}
