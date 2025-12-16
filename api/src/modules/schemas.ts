import { z } from "zod";

export const arrayNumberSchema = z
  .string()
  .optional()
  .transform((value) => (value || "").trim())
  .refine(
    (value) =>
      value === "" ||
      (value.split(",").some((id) => id.trim() !== "") &&
        value.split(",").every((id) => !isNaN(Number(id.trim())))),
    {
      message: "O campo deve ser uma lista de números separados por vírgula",
    },
  )
  .transform((value) =>
    value === "" ? undefined : value.split(",").map((id) => Number(id.trim())),
  );

export const arrayStringSchema = z
  .string()
  .optional()
  .transform((value) => (value || "").trim())
  .refine(
    (value) => value === "" || value.split(",").some((id) => id.trim() !== ""),
    {
      message: "O campo deve ser uma lista de strings separados por vírgula",
    },
  )
  .transform((value) =>
    value === "" ? undefined : value.split(",").map((id) => id.trim()),
  );

export const booleanSchema = z
  .string()
  .optional()
  .transform((value) => {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return undefined;
  });

export const dateSchema = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) {
        return true;
      }
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: "Data inválida",
    },
  );

export function enumSchema<T extends string>(
  values: readonly T[],
  mode: "up" | "lower" = "up",
) {
  const transformedValues = values.map((v) =>
    mode === "up" ? v.toUpperCase() : v.toLowerCase(),
  );

  return z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const normalized = value.toLowerCase();
        const index = values.map((v) => v.toLowerCase()).indexOf(normalized);
        return index !== -1 ? transformedValues[index] : undefined;
      }
      return undefined;
    },
    z
      .enum(transformedValues as [T, ...T[]])
      .refine(
        (val) => val === undefined || transformedValues.includes(val as T),
        {
          message: `Valor inválido. Valores aceitos: ${values
            .filter((col) => !col.includes(" AS "))
            .map((v) => (mode === "up" ? v.toUpperCase() : v.toLowerCase()))
            .join(", ")}`,
        },
      ),
  );
}

export const numberSchema = z
  .string()
  .optional()
  .refine((value) => value === undefined || !isNaN(Number(value)), {
    message: "A string deve representar um número válido.",
  })
  .transform((value) => (value === undefined ? undefined : Number(value)));

export const orderSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.toUpperCase() : value),
  z.enum(["ASC", "DESC"]).optional(),
);

export const paramsIdSchema = z.object({ id: numberSchema.default(0) });

export const paramsPublicIdSchema = z.object({ publicId: z.string() });

export const querySchema = z.object({
  search: z.string().optional(),
  order: orderSchema.default("ASC"),
  page: numberSchema,
  limit: numberSchema,
});
