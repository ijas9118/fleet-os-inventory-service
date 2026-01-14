import { z } from "zod";

import { WarehouseStatus } from "@/domain/enums";

export const updateWarehouseStatusSchema = z.object({
  status: z.enum([WarehouseStatus.ACTIVE, WarehouseStatus.MAINTENANCE, WarehouseStatus.CLOSED], {
    message: "Status must be ACTIVE, MAINTENANCE, or CLOSED",
  }),
});

export type UpdateWarehouseStatusDTO = z.infer<typeof updateWarehouseStatusSchema>;
