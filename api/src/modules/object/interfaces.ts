import { z } from "zod";

import {
  createObjectSchema,
  listObjectSchema,
  retrieveObjectSchema,
  updateObjectSchema,
} from "./schemas";

export interface IObject {
  id: number;
  name: string;
  public_id: string;
  created_at: Date;
  updated_at: Date;
}

export type IObjectCreate = z.infer<typeof createObjectSchema>;

export type IObjectList = z.infer<typeof listObjectSchema>;

export type IObjectRetrieve = z.infer<typeof retrieveObjectSchema>;

export type IObjectDTO = z.infer<typeof updateObjectSchema> & {
  id: number;
};
