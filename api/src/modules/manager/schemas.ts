import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createManagerSchema = z.object({
  name: z.string().min(2),
});

const defaultColumnsManager = [
  "id",
  "name",
  "public_id",
  "created_at",
  "updated_at",
];

export const listManagerSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsManager, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsManager, value, true),
    ),
  select: z
    .string()
    .optional()
    .transform((value) => (value || "").trim())
    .refine(
      (value) =>
        value === "" ||
        value
          .split(",")
          .every((col) => defaultColumnsManager.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsManager.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsManager, value)),
});

export const retrieveManagerSchema = z.object({
  id: numberSchema,
  select: z
    .string()
    .optional()
    .transform((value) => (value || "").trim())
    .refine(
      (value) =>
        value === "" ||
        value
          .split(",")
          .every((col) => defaultColumnsManager.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsManager.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsManager, value)),
});

export const updateManagerSchema = z
  .object({
    name: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field ("name") must be provided.',
  });
