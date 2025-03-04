import z, { ZodError, ZodNumber, ZodOptional } from "zod";

import { BuilderFormData } from "./builder";

function getValidationSchemaFromFormSchema(builderSchema: BuilderFormData[]) {
  let schema = z.object({});

  builderSchema.forEach((question, idx) => {
    switch (question.inputType) {
      case "text":
        {
          const textSchema = z.string();

          schema = schema.extend({
            [`text-${idx}`]: question.isRequired
              ? textSchema.min(question.minLength).max(question.maxLength)
              : textSchema
                  .transform((v) => v || undefined)
                  .nullable()
                  .optional(),
          });
        }
        break;
      case "number":
        {
          const numberSchema = z.string().transform((v) => {
            if (!v) {
              return undefined;
            }
            return Number(v);
          });

          let ns: ZodNumber | ZodOptional<ZodNumber> = z.number();
          if (question.minValue !== null) {
            ns = ns.min(question.minValue);
          }
          if (question.maxValue !== null) {
            ns = ns.max(question.maxValue);
          }
          if (!question.isRequired) {
            ns = ns.optional();
          }
          schema = schema.extend({
            [`number-${idx}`]: numberSchema.pipe(ns),
          });
        }
        break;
      case "options":
        {
          const options = question.options.map((option) =>
            z.literal(option.value),
          );
          const optionsSchema = z.string().transform((v) => {
            if (!v) {
              return undefined;
            }
            return v;
          });

          schema = schema.extend({
            [`select-${idx}`]: question.isRequired
              ? optionsSchema.pipe(
                  z.union(
                    options as unknown as readonly [
                      z.ZodTypeAny,
                      z.ZodTypeAny,
                      ...z.ZodTypeAny[],
                    ],
                  ),
                )
              : optionsSchema.nullable().optional(),
          });
        }
        break;
      default:
    }
  });

  return schema;
}

export default getValidationSchemaFromFormSchema;

export function getValidationErrors(error: ZodError): Record<string, string> {
  if (!(error instanceof ZodError)) {
    return {};
  }

  const errorMessages = error.issues.reduce(
    (acc, issue) => {
      acc[issue.path[0] as string] =
        issue.message === "Invalid input"
          ? "This field is required"
          : (issue.message as string);
      return acc;
    },
    {} as Record<string, string>,
  );

  return errorMessages;
}
