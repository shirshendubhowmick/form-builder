import z, { ZodError } from "zod";

const BaseInput = z.object({
  title: z.string().max(255).min(3),
  description: z.string().nullable(),
  isRequired: z
    .string()
    .optional()
    .transform((v) => {
      if (v === "on") {
        return true;
      }
      return false;
    })
    .pipe(z.boolean()),
});

export const TextInput = BaseInput.extend({
  inputType: z.literal("text"),
  maxLength: z
    .string()
    .transform((val) => {
      return Number(val);
    })
    .pipe(z.number().min(3).default(255)),
  minLength: z
    .string()
    .transform((val) => {
      return Number(val);
    })
    .pipe(z.number().min(3).default(3)),
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

export const BuilderFormSchema = z.union([TextInput, NumberInput, SelectInput]);
export type BuilderFormData = z.infer<typeof BuilderFormSchema>;

export interface ErrorMessages {
  title?: string | null;
  description?: string | null;
  isRequired?: string | null;
  maxLength?: string | null;
  minLength?: string | null;
  maxValue?: string | null;
  minValue?: string | null;
  options?: { [key: number]: string | null };
}

export function getBuilderSchemaErrors(error: ZodError): ErrorMessages {
  if (!(error instanceof ZodError)) {
    return {};
  }

  const errorMessages = error.issues.reduce((acc, issue) => {
    if (issue.path[0] === "options") {
      if (!acc.options) {
        acc.options = {};
      }
      acc.options[Number(issue.path[1])] = issue.message as string;
      return acc;
    }
    acc[issue.path[0] as keyof ErrorMessages] = issue.message as string;
    return acc;
  }, {} as ErrorMessages);

  return errorMessages;
}
