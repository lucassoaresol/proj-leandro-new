import { z } from "zod";

import {
  createCriteriaSchema,
  listCriteriaSchema,
  retrieveCriteriaSchema,
  updateCriteriaSchema,
} from "./schemas";

export interface ICriteria {
  id: number;
  name: string;
  public_id: string;
  created_at: Date;
  updated_at: Date;
}

export type ICriteriaCreate = z.infer<typeof createCriteriaSchema>;

export type ICriteriaList = z.infer<typeof listCriteriaSchema>;

export type ICriteriaRetrieve = z.infer<typeof retrieveCriteriaSchema>;

export type ICriteriaDTO = z.infer<typeof updateCriteriaSchema> & {
  id: number;
};
