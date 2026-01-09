import type { Stock } from "@/domain/entities";
import type { IStockRepository } from "@/domain/repositories";

import { Stock as StockEntity } from "@/domain/entities";

import type { CreateStockRecordDTO } from "./create-stock-record.dto";

export class CreateStockRecordUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: CreateStockRecordDTO): Promise<Stock> {
    // Check if stock record already exists
    const existing = await this._stockRepo.findByWarehouseAndItem(
      dto.warehouseId,
      dto.inventoryItemId,
      dto.tenantId,
    );

    if (existing) {
      throw new Error("Stock record already exists for this warehouse and item");
    }

    // Create new stock record
    const stock = new StockEntity({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
      quantity: dto.initialQuantity ?? 0,
    });

    // Persist to database
    const result = await this._stockRepo.create(stock);

    return result;
  }
}
