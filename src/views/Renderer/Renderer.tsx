import { useCallback } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { BuilderFormData } from "~/schemas/builder";

export interface RendererProps {
  schema: BuilderFormData[];
}

interface FormInputsProps {
  inputInfo: BuilderFormData;
  index: number;
}

function FormInputs(props: FormInputsProps) {
  switch (props.inputInfo.inputType) {
    case "text":
      return (
        <Input
          label={props.inputInfo.title}
          placeholder={props.inputInfo.description ?? undefined}
          name={`text-${props.index}`}
          className="mb-4"
        />
      );
    case "number":
      return (
        <Input
          label={props.inputInfo.title}
          placeholder={props.inputInfo.description ?? undefined}
          type="number"
          name={`number-${props.index}`}
          className="mb-4"
        />
      );
    case "options":
      return (
        <SelectInput
          label={props.inputInfo.title}
          name={`select-${props.index}`}
          options={props.inputInfo.options}
          ariaLabel={props.inputInfo.title}
          className="mb-4"
        />
      );
    default:
      return null;
  }
}

function Renderer(props: RendererProps) {
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData.entries());
  }, []);

  return (
    <div>
      <h1 className="mb-8">Preview</h1>
      <form onSubmit={onSubmit} className="flex flex-col">
        {props.schema.map((input, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FormInputs key={index} inputInfo={input} index={index} />
        ))}
        <Button type="submit" intent={INTENT.primary} color={COLOR.primary}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Renderer;
