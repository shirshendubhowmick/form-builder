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
  onSuccessfulAddOrUpdate: (data: BuilderFormData, formId?: number) => void;
  initialState?: BuilderFormData;
  formId?: number;
}

function Form(props: BuilderFormProps) {
  const [inputType, setInputType] = useState<InputType>(INPUT_TYPES[0].value);

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});

  const { onSuccessfulAddOrUpdate, formId } = props;

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

        onSuccessfulAddOrUpdate(result.data, formId);

        return;
      }

      const result = BuilderFormSchema.safeParse(
        Object.fromEntries(formData.entries()),
      );
      if (!result.success) {
        setErrorMessages(getBuilderSchemaErrors(result.error));
        return;
      }
      onSuccessfulAddOrUpdate(result.data, formId);
    },
    [formId, onSuccessfulAddOrUpdate],
  );

  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <Input
        label="Question title"
        placeholder="What is your name ?"
        name="title"
        className="mb-4"
        error={errorMessages.title}
        defaultValue={props.initialState?.title}
      />
      <Input
        label="Question description"
        placeholder="Type your question here"
        name="description"
        className="mb-4"
        error={errorMessages.description}
        defaultValue={props.initialState?.description ?? undefined}
      />
      <div className="mb-4 flex items-center">
        <SelectInput<InputType>
          options={INPUT_TYPES}
          label="Select an input type"
          name="inputType"
          ariaLabel="Input type"
          onValueChange={setInputType}
          className="mr-8"
          defaultValue={props.initialState?.inputType || INPUT_TYPES[0].value}
        />
        <Checkbox
          name="isRequired"
          label="Required ?"
          className="mt-4"
          defaulChecked={props.initialState?.isRequired}
        />
      </div>
      {Boolean(inputType) && (
        <InputMetaInfo
          type={inputType!}
          errorMessages={errorMessages}
          initialState={props.initialState}
        />
      )}
      {typeof props.formId !== "undefined" && (
        <input type="hidden" value={props.formId} name="formId" />
      )}
      <Button type="submit" intent={INTENT.primary} color={COLOR.primary}>
        {typeof props.formId === "undefined" ? "Add" : "Update"}
      </Button>
    </form>
  );
}

export default Form;
