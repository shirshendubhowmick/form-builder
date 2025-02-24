import z from "zod";

import { getValidationErrors } from "~/schemas/renderer";

// eslint-disable-next-line import/prefer-default-export
export function parseFormData<T extends z.ZodTypeAny>(
  formData: FormData,
  validationSchema: T,
): {
  data: z.infer<T>;
  errorMessages: Record<string, string> | null;
} {
  const result = validationSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return {
      data: null,
      errorMessages: getValidationErrors(result.error),
    };
  }

  return {
    data: result.data,
    errorMessages: null,
  };
}
