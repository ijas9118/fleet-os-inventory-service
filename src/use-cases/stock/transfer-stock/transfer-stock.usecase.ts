import type { IStockRepository, IStockTransactionRepository } from "@/domain/repositories";

import { Stock as StockEntity, StockTransaction } from "@/domain/entities";
import { StockTransactionType } from "@/domain/enums";
import { StockNotFoundError } from "@/domain/errors";

import type { TransferStockDTO } from "./transfer-stock.dto";

export class TransferStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: TransferStockDTO): Promise<{ source: any; destination: any }> {
    // Find source stock record
    const sourceStock = await this._stockRepo.findByWarehouseAndItem(
      dto.sourceWarehouseId,
      dto.inventoryItemId,
      dto.tenantId,
    );

    if (!sourceStock) {
      throw new StockNotFoundError(`${dto.sourceWarehouseId}-${dto.inventoryItemId}`);
    }

    // Decrease source quantity (will throw if insufficient)
    sourceStock.decreaseQuantity(dto.quantity);

    // Create TRANSFER_OUT transaction
    const transferOutTransaction = new StockTransaction({
      tenantId: dto.tenantId,
      warehouseId: dto.sourceWarehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: StockTransactionType.TRANSFER_OUT,
      quantity: dto.quantity,
      notes: dto.notes
        ? `${dto.notes} (to warehouse: ${dto.destinationWarehouseId})`
        : `Transfer to warehouse: ${dto.destinationWarehouseId}`,
      referenceId: dto.referenceId,
    });

    const createdTransferOut = await this._transactionRepo.create(transferOutTransaction);

    // Update source stock record
    await this._stockRepo.update(sourceStock.id!, sourceStock.propsSnapshot);

    // Find or create destination stock record
    let destinationStock = await this._stockRepo.findByWarehouseAndItem(
      dto.destinationWarehouseId,
      dto.inventoryItemId,
      dto.tenantId,
    );

    if (!destinationStock) {
      // Create new stock record if it doesn't exist
      destinationStock = new StockEntity({
        tenantId: dto.tenantId,
        warehouseId: dto.destinationWarehouseId,
        inventoryItemId: dto.inventoryItemId,
        quantity: 0,
      });
      destinationStock = await this._stockRepo.create(destinationStock);
    }

    // Increase destination quantity
    destinationStock.increaseQuantity(dto.quantity);

    // Create TRANSFER_IN transaction (linked to TRANSFER_OUT)
    const transferInTransaction = new StockTransaction({
      tenantId: dto.tenantId,
      warehouseId: dto.destinationWarehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: StockTransactionType.TRANSFER_IN,
      quantity: dto.quantity,
      notes: dto.notes
        ? `${dto.notes} (from warehouse: ${dto.sourceWarehouseId})`
        : `Transfer from warehouse: ${dto.sourceWarehouseId}`,
      referenceId: dto.referenceId,
      relatedTransactionId: createdTransferOut.id,
    });

    await this._transactionRepo.create(transferInTransaction);

    // Update destination stock record
    await this._stockRepo.update(destinationStock.id!, destinationStock.propsSnapshot);

    // Return both updated stock records
    const updatedSource = await this._stockRepo.findById(sourceStock.id!, dto.tenantId);
    const updatedDestination = await this._stockRepo.findById(destinationStock.id!, dto.tenantId);

    return {
      source: updatedSource,
      destination: updatedDestination,
    };
  }
}
