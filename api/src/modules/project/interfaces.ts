import { z } from "zod";

import {
  createProjectSchema,
  listProjectSchema,
  retrieveProjectSchema,
  updateProjectSchema,
} from "./schemas";

export type IProjectStatus = "OPEN" | "FINISHED" | "CANCELED";

export interface IProject {
  id: number;
  name: string;
  description?: string;
  started_at?: Date;
  ended_at?: Date;
  status: IProjectStatus;
  public_id: string;
  created_at: Date;
  updated_at: Date;
}

export type IProjectCreate = z.infer<typeof createProjectSchema>;

export type IProjectList = z.infer<typeof listProjectSchema>;

export type IProjectRetrieve = z.infer<typeof retrieveProjectSchema>;

export type IProjectDTO = z.infer<typeof updateProjectSchema> & {
  id: number;
};
