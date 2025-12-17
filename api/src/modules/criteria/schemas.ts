import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createCriteriaSchema = z.object({
  name: z.string().min(2),
});

const defaultColumnsCriteria = [
  "id",
  "name",
  "public_id",
  "created_at",
  "updated_at",
];

export const listCriteriaSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsCriteria, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsCriteria, value, true),
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
          .every((col) => defaultColumnsCriteria.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsCriteria, value),
    ),
});

export const retrieveCriteriaSchema = z.object({
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
          .every((col) => defaultColumnsCriteria.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsCriteria, value),
    ),
});

export const updateCriteriaSchema = z
  .object({
    name: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field ("name") must be provided.',
  });
