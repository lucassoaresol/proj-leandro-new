import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createProjectObjectSchema = z.object({
  project_id: z.number(),
  object_id: z.number(),
});

const defaultColumnsProjectObject = [
  "id",
  "created_at",
  "updated_at",
  "object_id",
  "o.name AS object_name",
  "project_id",
  "p.name AS project_name",
];

export const listProjectObjectSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsProjectObject, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsProjectObject, value, true),
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
          .every((col) => defaultColumnsProjectObject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectObject.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectObject, value),
    ),
});

export const retrieveProjectObjectSchema = z.object({
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
          .every((col) => defaultColumnsProjectObject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectObject.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(defaultColumnsProjectObject, value),
    ),
});
