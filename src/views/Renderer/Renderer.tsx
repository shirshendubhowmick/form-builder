import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { BuilderFormData } from "~/schemas/builder";
import getValidationSchemaFromFormSchema from "~/schemas/renderer";

import { parseFormData } from "./utils";

export interface RendererProps {
  schema: BuilderFormData[];
}

interface FormInputsProps {
  inputInfo: BuilderFormData;
  index: number;
  errorMessages: Record<string, string>;
}

function FormInputs(props: FormInputsProps) {
  switch (props.inputInfo.inputType) {
    case "text":
      return (
        <Input
          label={props.inputInfo.title}
          placeholder={props.inputInfo.description ?? undefined}
          name={`text-${props.index}`}
          containerClassName="mb-4"
          error={props.errorMessages[`text-${props.index}`]}
        />
      );
    case "number":
      return (
        <Input
          label={props.inputInfo.title}
          placeholder={props.inputInfo.description ?? undefined}
          type="number"
          name={`number-${props.index}`}
          containerClassName="mb-4"
          error={props.errorMessages[`number-${props.index}`]}
        />
      );
    case "options":
      return (
        <SelectInput
          label={props.inputInfo.title}
          name={`select-${props.index}`}
          options={props.inputInfo.options}
          ariaLabel={props.inputInfo.title}
          className="mb-2"
          error={props.errorMessages[`select-${props.index}`]}
          containerClassName="mb-4"
        />
      );
    default:
      return null;
  }
}

function Renderer(props: RendererProps) {
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {},
  );

  const validationSchema = useMemo(() => {
    return getValidationSchemaFromFormSchema(props.schema);
  }, [props.schema]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const result = parseFormData(formData, validationSchema);

      if (result.data) {
        toast.success("Form submitted successfully");
        return;
      }

      if (result.errorMessages) {
        setErrorMessages(result.errorMessages);
      }
    },
    [validationSchema],
  );

  const onChange = useCallback(() => {
    setErrorMessages({});
  }, []);

  return (
    <div>
      <h1 className="mb-8">Preview</h1>
      <div className="mx-auto max-w-3xl">
        <form onSubmit={onSubmit} className="flex flex-col" onChange={onChange}>
          {props.schema.map((input, index) => (
            <FormInputs
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              inputInfo={input}
              index={index}
              errorMessages={errorMessages}
            />
          ))}
          <Button type="submit" intent={INTENT.primary} color={COLOR.primary}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Renderer;
