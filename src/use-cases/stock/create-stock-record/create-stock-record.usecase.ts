import type { Stock } from "@/domain/entities";
import type { IInventoryItemRepository, IStockRepository, IWareHouseRepository } from "@/domain/repositories";

import { Stock as StockEntity } from "@/domain/entities";
import { InventoryItemNotFoundError, WarehouseNotFoundError } from "@/domain/errors";

import type { CreateStockRecordDTO } from "./create-stock-record.dto";

export class CreateStockRecordUseCase {
  constructor(
    private _stockRepo: IStockRepository,
    private _warehouseRepo: IWareHouseRepository,
    private _inventoryItemRepo: IInventoryItemRepository,
  ) {}

  async execute(dto: CreateStockRecordDTO): Promise<Stock> {
    // Validate warehouse exists
    const warehouse = await this._warehouseRepo.findById(dto.warehouseId, dto.tenantId);
    if (!warehouse) {
      throw new WarehouseNotFoundError(dto.warehouseId);
    }

    // Validate inventory item exists
    const inventoryItem = await this._inventoryItemRepo.findById(dto.inventoryItemId, dto.tenantId);
    if (!inventoryItem) {
      throw new InventoryItemNotFoundError(dto.inventoryItemId);
    }

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
