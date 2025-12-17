import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createGroupSchema = z.object({
  name: z.string().min(2),
});

const defaultColumnsGroup = [
  "id",
  "name",
  "public_id",
  "created_at",
  "updated_at",
];

export const listGroupSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsGroup, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(defaultColumnsGroup, value, true),
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
          .every((col) => defaultColumnsGroup.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsGroup.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsGroup, value)),
});

export const retrieveGroupSchema = z.object({
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
          .every((col) => defaultColumnsGroup.includes(col.trim())),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsGroup.join(", ")}`,
      },
    )
    .transform((value) => transformSelectColumns(defaultColumnsGroup, value)),
});

export const updateGroupSchema = z
  .object({
    name: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field ("name") must be provided.',
  });
