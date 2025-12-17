import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createObjectSchema = z.object({
  name: z.string().min(2),
  group_id: z.number(),
});

const defaultColumnsObject = [
  "id",
  "name",
  "public_id",
  "created_at",
  "updated_at",
  "group_id",
  "g.name AS group_name",
];

export const listObjectSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsObject, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsObject, value, true),
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
          .every((col) => defaultColumnsObject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsObject.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsObject, value)),
});

export const retrieveObjectSchema = z.object({
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
          .every((col) => defaultColumnsObject.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsObject.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsObject, value)),
});

export const updateObjectSchema = z
  .object({
    name: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field ("name") must be provided.',
  });
