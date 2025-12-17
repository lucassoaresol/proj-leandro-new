import { z } from "zod";

import {
  createProjectCriteriaSchema,
  listProjectCriteriaSchema,
  retrieveProjectCriteriaSchema,
  updateProjectCriteriaSchema,
} from "./schemas";

export interface IProjectCriteria {
  id: number;
  importance_weight: number;
  project_id: number;
  criteria_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IProjectCriteriaCreate = z.infer<
  typeof createProjectCriteriaSchema
>;

export type IProjectCriteriaList = z.infer<typeof listProjectCriteriaSchema>;

export type IProjectCriteriaRetrieve = z.infer<
  typeof retrieveProjectCriteriaSchema
>;

export type IProjectCriteriaDTO = z.infer<
  typeof updateProjectCriteriaSchema
> & {
  id: number;
};
