import { z } from "zod";

import {
  createManagerSchema,
  listManagerSchema,
  retrieveManagerSchema,
  updateManagerSchema,
} from "./schemas";

export interface IManager {
  id: number;
  name: string;
  public_id: string;
  created_at: Date;
  updated_at: Date;
}

export type IManagerCreate = z.infer<typeof createManagerSchema>;

export type IManagerList = z.infer<typeof listManagerSchema>;

export type IManagerRetrieve = z.infer<typeof retrieveManagerSchema>;

export type IManagerDTO = z.infer<typeof updateManagerSchema> & {
  id: number;
};
