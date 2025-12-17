import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import { enumSchema, numberSchema, querySchema } from "../schemas";

export const createProjectCriterionPairwiseEvaluationSchema = z.object({
  rating: z.number().int().positive().optional().default(1),
  manager_id: z.number(),
  criterion_a_id: z.number(),
  criterion_b_id: z.number(),
});

const defaultColumnsProjectCriterionPairwiseEvaluation = [
  "id",
  "rating",
  "created_at",
  "updated_at",
  "manager_id",
  "m.name AS manager_name",
  "criterion_a_id",
  "ca.name AS criterion_a_name",
  "criterion_b_id",
  "cb.name AS criterion_b_name",
];

export const listProjectCriterionPairwiseEvaluationSchema = querySchema.extend({
  sort: enumSchema(defaultColumnsProjectCriterionPairwiseEvaluation, "lower")
    .optional()
    .transform((value) =>
      getColumnForSorting(
        defaultColumnsProjectCriterionPairwiseEvaluation,
        value,
        true,
      ),
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
            defaultColumnsProjectCriterionPairwiseEvaluation.includes(
              col.trim(),
            ),
          ),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectCriterionPairwiseEvaluation.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(
        defaultColumnsProjectCriterionPairwiseEvaluation,
        value,
      ),
    ),
});

export const retrieveProjectCriterionPairwiseEvaluationSchema = z.object({
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
            defaultColumnsProjectCriterionPairwiseEvaluation.includes(
              col.trim(),
            ),
          ),
      {
        message: `Valor inválido. Valores aceitos: ${defaultColumnsProjectCriterionPairwiseEvaluation.join(", ")}`,
      },
    )
    .transform((value) =>
      transformSelectColumns(
        defaultColumnsProjectCriterionPairwiseEvaluation,
        value,
      ),
    ),
});

export const updateProjectCriterionPairwiseEvaluationSchema = z.object({
  rating: z.number().int().positive().optional(),
});
