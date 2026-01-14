import { z } from "zod";

export const CreateInventoryItemDTOSchema = z.object({
  sku: z.string().min(1, "SKU is required").toUpperCase(),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1, "Unit of measurement is required"),
  minStockLevel: z.number().min(0, "Minimum stock level cannot be negative").optional(),
  maxStockLevel: z.number().min(0, "Maximum stock level cannot be negative").optional(),
  reorderPoint: z.number().min(0, "Reorder point cannot be negative").optional(),
}).refine(
  (data) => {
    if (data.minStockLevel !== undefined && data.maxStockLevel !== undefined) {
      return data.minStockLevel <= data.maxStockLevel;
    }
    return true;
  },
  {
    message: "Minimum stock level cannot exceed maximum stock level",
    path: ["minStockLevel"],
  },
);

export type CreateInventoryItemSchemaType = z.infer<typeof CreateInventoryItemDTOSchema>;
