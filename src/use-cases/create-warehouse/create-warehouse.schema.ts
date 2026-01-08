import { z } from "zod";

export const AddressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
    lng: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  }),
});

export const CreateWarehouseDTOSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  code: z.string().min(1, "Warehouse code is required").toUpperCase(),
  address: AddressSchema,
});

export type CreateWarehouseSchemaType = z.infer<typeof CreateWarehouseDTOSchema>;
