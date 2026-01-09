import type { Stock } from "@/domain/entities";
import type { IStockRepository, IStockTransactionRepository } from "@/domain/repositories";

import { Stock as StockEntity, StockTransaction } from "@/domain/entities";
import { StockTransactionType } from "@/domain/enums";

import type { AdjustStockDTO } from "./adjust-stock.dto";

export class AdjustStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: AdjustStockDTO): Promise<Stock> {
    // Find or create stock record
    let stock = await this._stockRepo.findByWarehouseAndItem(
      dto.warehouseId,
      dto.inventoryItemId,
      dto.tenantId,
    );

    if (!stock) {
      // Create new stock record if it doesn't exist
      stock = new StockEntity({
        tenantId: dto.tenantId,
        warehouseId: dto.warehouseId,
        inventoryItemId: dto.inventoryItemId,
        quantity: 0,
      });
      stock = await this._stockRepo.create(stock);
    }

    // Adjust quantity (can be positive or negative)
    stock.adjustQuantity(dto.adjustment);

    // Create ADJUSTMENT transaction (store absolute value)
    const transaction = new StockTransaction({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: StockTransactionType.ADJUSTMENT,
      quantity: Math.abs(dto.adjustment),
      notes: dto.notes
        ? `${dto.notes} (${dto.adjustment > 0 ? "+" : ""}${dto.adjustment})`
        : `Adjustment: ${dto.adjustment > 0 ? "+" : ""}${dto.adjustment}`,
      referenceId: dto.referenceId,
    });

    await this._transactionRepo.create(transaction);

    // Update stock record
    await this._stockRepo.update(stock.id!, stock.propsSnapshot);

    // Return updated stock
    const updatedStock = await this._stockRepo.findById(stock.id!, dto.tenantId);
    return updatedStock!;
  }
}
