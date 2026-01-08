import { z } from "zod";

export const updateWarehouseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  code: z.string().min(1, "Code is required").max(50, "Code must be at most 50 characters"),
  address: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  }),
});

export type UpdateWarehouseSchemaType = z.infer<typeof updateWarehouseSchema>;
