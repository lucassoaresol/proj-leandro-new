import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import {
  arrayNumberSchema,
  enumSchema,
  numberSchema,
  querySchema,
} from "../schemas";

export const createProjectCriteriaSchema = z.object({
  optimization_goal: z.enum(["MAXIMIZE", "MINIMIZE"]),
  project_id: z.number(),
  criteria_id: z.number(),
});

const defaultColumnsProjectCriteria = [
  "id",
  "optimization_goal",
  "created_at",
  "updated_at",
  "criteria_id",
  "c.name AS criteria_name",
  "project_id",
  "p.name AS project_name",
];

export const listProjectCriteriaSchema = querySchema.extend({
  criteria_id: arrayNumberSchema,
  project_id: arrayNumberSchema,
  sort: enumSchema(defaultColumnsProjectCriteria, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsProjectCriteria, value, true),
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
          .every((col) => defaultColumnsProjectCriteria.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectCriteria, value),
    ),
});

export const retrieveProjectCriteriaSchema = z.object({
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
          .every((col) => defaultColumnsProjectCriteria.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectCriteria.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectCriteria, value),
    ),
});

export const updateProjectCriteriaSchema = z.object({
  optimization_goal: z.enum(["MAXIMIZE", "MINIMIZE"]).optional(),
});
