import { z } from "zod";

import {
  createProjectObjectSchema,
  listProjectObjectSchema,
  retrieveProjectObjectSchema,
} from "./schemas";

export interface IProjectObject {
  id: number;
  project_id: number;
  object_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IProjectObjectCreate = z.infer<typeof createProjectObjectSchema>;

export type IProjectObjectList = z.infer<typeof listProjectObjectSchema>;

export type IProjectObjectRetrieve = z.infer<
  typeof retrieveProjectObjectSchema
>;
