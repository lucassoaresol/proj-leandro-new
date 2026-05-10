import { z } from "zod";

import { getColumnForSorting } from "../../utils/getColumnForSorting";
import { transformSelectColumns } from "../../utils/transformSelectColumns";
import {
  arrayNumberSchema,
  enumSchema,
  numberSchema,
  querySchema,
} from "../schemas";

const saatyRatings = [1, 3, 5, 7, 9, 1 / 3, 1 / 5, 1 / 7, 1 / 9];
const ratingTolerance = 0.0000000001;

const saatyRatingSchema = z
  .number()
  .positive()
  .refine(
    (value) =>
      saatyRatings.some(
        (allowedValue) => Math.abs(value - allowedValue) < ratingTolerance,
      ),
    {
      message:
        "Rating must be one of the Saaty scale values: 1, 3, 5, 7, 9, 1/3, 1/5, 1/7, or 1/9",
    },
  );

export const createProjectCriterionPairwiseEvaluationSchema = z.object({
  rating: saatyRatingSchema.optional().default(1),
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
  manager_id: arrayNumberSchema,
  project_id: numberSchema,
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
  rating: saatyRatingSchema.optional(),
});

export const calculateProjectCriterionCRSchema = z.object({
  manager_id: z.number(),
  project_id: z.number(),
});
