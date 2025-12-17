import { z } from "zod";

import {
  createGroupSchema,
  listGroupSchema,
  retrieveGroupSchema,
  updateGroupSchema,
} from "./schemas";

export interface IGroup {
  id: number;
  name: string;
  public_id: string;
  created_at: Date;
  updated_at: Date;
}

export type IGroupCreate = z.infer<typeof createGroupSchema>;

export type IGroupList = z.infer<typeof listGroupSchema>;

export type IGroupRetrieve = z.infer<typeof retrieveGroupSchema>;

export type IGroupDTO = z.infer<typeof updateGroupSchema> & {
  id: number;
};
