import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createProjectObjectCriteriaSchema = z.object({
  value: z.number().int().positive(),
  object_id: z.number(),
  criteria_id: z.number(),
});

const defaultColumnsProjectObjectCriteria = [
  "id",
  "value",
  "created_at",
  "updated_at",
  "object_id",
  "o.name AS object_name",
  "criteria_id",
  "c.name AS criteria_name",
];

export const listProjectObjectCriteriaSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsProjectObjectCriteria, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsProjectObjectCriteria, value, true),
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
          .every((col) =>
            defaultColumnsProjectObjectCriteria.includes(col.trim()),
          ),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectObjectCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectObjectCriteria, value),
    ),
});

export const retrieveProjectObjectCriteriaSchema = z.object({
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
          .every((col) =>
            defaultColumnsProjectObjectCriteria.includes(col.trim()),
          ),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectObjectCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectObjectCriteria, value),
    ),
});

export const updateProjectObjectCriteriaSchema = z.object({
  value: z.number().int().positive().optional(),
});
