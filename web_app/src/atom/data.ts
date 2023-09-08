import { atom } from "jotai";
import { z } from "zod";

const TankDataSchema = z.object({
  tankName: z.string(),
  tankSerialNumber: z.string(),
  telemetryDatetimeEpoch: z.number(),
  tankLevel: z.number(),
  tankCustomerName: z.string(),
});

// Define the type for your TankData
type TankData = z.infer<typeof TankDataSchema>;

export const panelAtom = atom<TankData[]>([]);
