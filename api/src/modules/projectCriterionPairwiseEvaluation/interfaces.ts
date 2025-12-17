import { z } from "zod";

import {
  createProjectCriterionPairwiseEvaluationSchema,
  listProjectCriterionPairwiseEvaluationSchema,
  retrieveProjectCriterionPairwiseEvaluationSchema,
  updateProjectCriterionPairwiseEvaluationSchema,
} from "./schemas";

export interface IProjectCriterionPairwiseEvaluation {
  id: number;
  rating: number;
  manager_id: number;
  criterion_a_id: number;
  criterion_b_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IProjectCriterionPairwiseEvaluationCreate = z.infer<
  typeof createProjectCriterionPairwiseEvaluationSchema
>;
export type IProjectCriterionPairwiseEvaluationList = z.infer<
  typeof listProjectCriterionPairwiseEvaluationSchema
>;

export type IProjectCriterionPairwiseEvaluationRetrieve = z.infer<
  typeof retrieveProjectCriterionPairwiseEvaluationSchema
>;

export type IProjectCriterionPairwiseEvaluationDTO = z.infer<
  typeof updateProjectCriterionPairwiseEvaluationSchema
> & {
  id: number;
};
