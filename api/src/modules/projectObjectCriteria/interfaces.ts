import { z } from "zod";

import {
  createProjectObjectCriteriaSchema,
  listProjectObjectCriteriaSchema,
  retrieveProjectObjectCriteriaSchema,
  updateProjectObjectCriteriaSchema,
} from "./schemas";

export interface IProjectObjectCriteria {
  id: number;
  value: number;
  object_id: number;
  criteria_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IProjectObjectCriteriaCreate = z.infer<
  typeof createProjectObjectCriteriaSchema
>;
export type IProjectObjectCriteriaList = z.infer<
  typeof listProjectObjectCriteriaSchema
>;

export type IProjectObjectCriteriaRetrieve = z.infer<
  typeof retrieveProjectObjectCriteriaSchema
>;

export type IProjectObjectCriteriaDTO = z.infer<
  typeof updateProjectObjectCriteriaSchema
> & {
  id: number;
};
