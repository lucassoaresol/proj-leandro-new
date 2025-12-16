import { z } from "zod";

import { paramsIdSchema, paramsPublicIdSchema, querySchema } from "./schemas";

export type IOrderBy = { [key: string]: "ASC" | "DESC" };

export type IParamsId = z.infer<typeof paramsIdSchema>;

export type IParamsPublicId = z.infer<typeof paramsPublicIdSchema>;

export type IQuery = z.infer<typeof querySchema>;

export type IWhere = { [key: string]: any };
