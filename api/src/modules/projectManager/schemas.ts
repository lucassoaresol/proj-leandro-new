import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createProjectManagerSchema = z.object({
  project_id: z.number(),
  manager_id: z.number(),
  importance_weight: z.number().int().positive().optional().default(1),
});

const defaultColumnsProjectManager = [
  "id",
  "importance_weight",
  "created_at",
  "updated_at",
  "manager_id",
  "m.name AS manager_name",
  "project_id",
  "p.name AS project_name",
];

export const listProjectManagerSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsProjectManager, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsProjectManager, value, true),
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
          .every((col) => defaultColumnsProjectManager.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectManager.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectManager, value),
    ),
});

export const retrieveProjectManagerSchema = z.object({
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
          .every((col) => defaultColumnsProjectManager.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectManager.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectManager, value),
    ),
});

export const updateProjectManagerSchema = z.object({
  importance_weight: z.number().int().positive().optional(),
});
