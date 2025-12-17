import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  started_at: z.coerce.date().optional(),
  ended_at: z.coerce.date().optional(),
});

const defaultColumnsProject = [
  "id",
  "name",
  "description",
  "started_at",
  "ended_at",
  "public_id",
  "created_at",
  "updated_at",
];

export const listProjectSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsProject, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsProject, value, true),
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
          .every((col) => defaultColumnsProject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProject.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsProject, value)),
});

export const retrieveProjectSchema = z.object({
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
          .every((col) => defaultColumnsProject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProject.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsProject, value)),
});

export const updateProjectSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    started_at: z.coerce.date().optional(),
    ended_at: z.coerce.date().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message:
      'At least one field ("name", "description", "started_at", "ended_at") must be provided.',
  });
