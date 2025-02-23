import {
  BuilderFormData,
  BuilderFormSchema,
  ErrorMessages,
  getBuilderSchemaErrors,
} from "~/schemas/builder";
import { LabelValuePair } from "~/types";

// eslint-disable-next-line import/prefer-default-export
export function parseFormData(formData: FormData): {
  data: BuilderFormData | null;
  errorMessages: ErrorMessages | null;
} {
  if (formData.get("inputType") === "options") {
    const options: LabelValuePair[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("option-")) {
        options.push({
          label: value as string,
          value: value as string,
        });
      }
    });

    const result = BuilderFormSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      options,
    });

    if (!result.success) {
      return {
        data: null,
        errorMessages: getBuilderSchemaErrors(result.error),
      };
    }

    return {
      data: result.data,
      errorMessages: null,
    };
  }

  const result = BuilderFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return {
      data: null,
      errorMessages: getBuilderSchemaErrors(result.error),
    };
  }

  return {
    data: result.data,
    errorMessages: null,
  };
}
