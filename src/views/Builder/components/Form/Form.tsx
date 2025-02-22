import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Checkbox from "~/components/Checkbox/Checkbox";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { INPUT_TYPES, InputType } from "~/constants";
import {
  BuilderFormData,
  BuilderFormSchema,
  ErrorMessages,
  getBuilderSchemaErrors,
} from "~/schemas/builder";
import { LabelValuePair } from "~/types";

import InputMetaInfo from "../InputMetaInfo/InputMetaInfo";

export interface BuilderFormProps {
  onSuccessfulAdd: (data: BuilderFormData) => void;
}

function Form(props: BuilderFormProps) {
  const [inputType, setInputType] = useState<InputType>(INPUT_TYPES[0].value);

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});

  const { onSuccessfulAdd } = props;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

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
          setErrorMessages(getBuilderSchemaErrors(result.error));
          return;
        }

        onSuccessfulAdd(result.data);

        return;
      }

      const result = BuilderFormSchema.safeParse(
        Object.fromEntries(formData.entries()),
      );
      if (!result.success) {
        setErrorMessages(getBuilderSchemaErrors(result.error));
        return;
      }
      onSuccessfulAdd(result.data);
    },
    [onSuccessfulAdd],
  );

  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <Input
        label="Question title"
        placeholder="What is your name ?"
        name="title"
        className="mb-4"
        error={errorMessages.title}
      />
      <Input
        label="Question description"
        placeholder="Type your question here"
        name="description"
        className="mb-4"
        error={errorMessages.description}
      />
      <div className="mb-4 flex items-center">
        <SelectInput<InputType>
          options={INPUT_TYPES}
          label="Select an input type"
          name="inputType"
          ariaLabel="Input type"
          onValueChange={setInputType}
          className="mr-8"
          defaultValue={INPUT_TYPES[0].value}
        />
        <Checkbox name="isRequired" label="Required ?" className="mt-4" />
      </div>
      {Boolean(inputType) && (
        <InputMetaInfo type={inputType!} errorMessages={errorMessages} />
      )}
      <Button type="submit" intent={INTENT.primary} color={COLOR.primary}>
        Add
      </Button>
    </form>
  );
}

export default Form;
