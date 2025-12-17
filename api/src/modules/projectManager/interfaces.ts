import { z } from "zod";

import {
  createProjectManagerSchema,
  listProjectManagerSchema,
  retrieveProjectManagerSchema,
  updateProjectManagerSchema,
} from "./schemas";

export interface IProjectManager {
  id: number;
  importance_weight: number;
  project_id: number;
  manager_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IProjectManagerCreate = z.infer<typeof createProjectManagerSchema>;

export type IProjectManagerList = z.infer<typeof listProjectManagerSchema>;

export type IProjectManagerRetrieve = z.infer<
  typeof retrieveProjectManagerSchema
>;

export type IProjectManagerDTO = z.infer<typeof updateProjectManagerSchema> & {
  id: number;
};
