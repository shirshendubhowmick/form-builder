import z from "zod";

const BaseInput = z.object({
  title: z.string().max(255).min(3),
  description: z.string().nullable(),
  required: z.boolean().default(false),
});

export const TextInput = BaseInput.extend({
  type: z.literal("text"),
  maxLength: z.number().default(255),
  minLength: z.number().default(0),
});

export const NumberInput = BaseInput.extend({
  type: z.literal("number"),
  max: z.number().nullable(),
  min: z.number().nullable(),
});

export const SelectInput = BaseInput.extend({
  type: z.literal("options"),
  options: z.array(
    z.object({
      label: z.string().min(3).max(255),
      value: z.string().min(3).max(255),
    }),
  ),
});

export const Input = z.union([TextInput, NumberInput, SelectInput]);
