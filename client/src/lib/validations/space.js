import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(24, "Name must be 24 characters or fewer")
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only");

const mapIdSchema = z
  .string()
  .min(1, "Map ID is required")
  .max(24, "Map ID must be 24 characters or fewer")
  .regex(/^[0-9]+$/, "Use letters, numbers, and underscores only");

const descriptionSchema = z
  .string()
  .max(200, "Description must be 200 characters or fewer")
  .optional();

export const CreateSchema = z.object({
  nom: nameSchema,
  mapId: mapIdSchema,
  description: descriptionSchema,
});
