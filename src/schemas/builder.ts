import z from "zod";

const BaseInput = z.object({
  title: z.string().max(255).min(3),
  description: z.string().nullable(),
  required: z.boolean().default(false),
});

export const TextInput = BaseInput.extend({
  inputType: z.literal("text"),
  maxLength: z
    .string()
    .transform((val) => {
      return Number(val);
    })
    .pipe(z.number().default(255)),
  minLength: z
    .string()
    .transform((val) => {
      return Number(val);
    })
    .pipe(z.number().default(3)),
});

export const NumberInput = BaseInput.extend({
  inputType: z.literal("number"),
  maxValue: z
    .string()
    .transform((val) => {
      if (!val) {
        return null;
      }
      return Number(val);
    })
    .pipe(z.number().nullable()),
  minValue: z
    .string()
    .transform((val) => {
      if (!val) {
        return null;
      }
      return Number(val);
    })
    .pipe(z.number().nullable()),
});

export const SelectInput = BaseInput.extend({
  inputType: z.literal("options"),
  options: z.array(
    z.object({
      label: z.string().min(3).max(255),
      value: z.string().min(3).max(255),
    }),
  ),
});

export const BuilderSchema = z.union([TextInput, NumberInput, SelectInput]);
