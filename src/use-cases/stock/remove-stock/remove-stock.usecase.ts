import type { Stock } from "@/domain/entities";
import type { IStockRepository, IStockTransactionRepository } from "@/domain/repositories";

import { StockTransaction } from "@/domain/entities";
import { StockTransactionType } from "@/domain/enums";
import { StockNotFoundError } from "@/domain/errors";

import type { RemoveStockDTO } from "./remove-stock.dto";

export class RemoveStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: RemoveStockDTO): Promise<Stock> {
    // Find stock record
    const stock = await this._stockRepo.findByWarehouseAndItem(
      dto.warehouseId,
      dto.inventoryItemId,
      dto.tenantId,
    );

    if (!stock) {
      throw new StockNotFoundError(`${dto.warehouseId}-${dto.inventoryItemId}`);
    }

    // Decrease quantity (will throw if insufficient)
    stock.decreaseQuantity(dto.quantity);

    // Create OUT transaction
    const transaction = new StockTransaction({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: StockTransactionType.OUT,
      quantity: dto.quantity,
      notes: dto.notes,
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
