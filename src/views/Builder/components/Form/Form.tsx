import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Checkbox from "~/components/Checkbox/Checkbox";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { INPUT_TYPES, InputType } from "~/constants";
import { BuilderFormData, ErrorMessages } from "~/schemas/builder";

import InputMetaInfo from "../InputMetaInfo/InputMetaInfo";
import { parseFormData } from "./util";

export interface BuilderFormProps {
  onSuccessfulAddOrUpdate: (data: BuilderFormData, formId?: number) => void;
  initialState?: BuilderFormData;
  formId?: number;
}

function Form(props: BuilderFormProps) {
  const [inputType, setInputType] = useState<InputType>(
    props.initialState?.inputType ?? INPUT_TYPES[0].value,
  );

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});

  const { onSuccessfulAddOrUpdate, formId } = props;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const { data, errorMessages: errors } = parseFormData(formData);

      if (data) {
        onSuccessfulAddOrUpdate(data, formId);
        return;
      }

      if (errors) {
        setErrorMessages(errors);
      }
    },
    [formId, onSuccessfulAddOrUpdate],
  );

  const onChange = useCallback((e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    console.log("formData", formData);
  }, []);

  return (
    <form className="flex flex-col" onSubmit={onSubmit} onChange={onChange}>
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
