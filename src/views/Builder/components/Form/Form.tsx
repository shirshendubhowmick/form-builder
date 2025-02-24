import { useCallback, useMemo, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Checkbox from "~/components/Checkbox/Checkbox";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { INPUT_TYPES, InputType } from "~/constants";
import { BuilderFormData, ErrorMessages } from "~/schemas/builder";
import { debounce } from "~/utils";

import InputMetaInfo from "../InputMetaInfo/InputMetaInfo";
import { parseFormData } from "./util";

export interface BuilderFormProps {
  onSuccessfulAddOrUpdate: (data: BuilderFormData, questionId?: number) => void;
  onSuccessfulChange: (
    data: BuilderFormData,
    isNewEntry?: boolean,
    questionId?: number,
  ) => void;
  isNewEntry?: boolean;
  initialState?: BuilderFormData;
  questionId?: number;
  isSubmitting: boolean;
}

function Form(props: BuilderFormProps) {
  const [inputType, setInputType] = useState<InputType>(
    props.initialState?.inputType ?? INPUT_TYPES[0].value,
  );
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});
  const formRef = useRef<HTMLFormElement>(null);

  const {
    onSuccessfulAddOrUpdate,
    questionId,
    onSuccessfulChange,
    isNewEntry,
  } = props;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const { data, errorMessages: errors } = parseFormData(formData);

      if (data) {
        onSuccessfulAddOrUpdate(data, questionId);
        return;
      }

      if (errors) {
        setErrorMessages(errors);
      }
    },
    [questionId, onSuccessfulAddOrUpdate],
  );

  const onChange = useCallback(() => {
    const formData = new FormData(formRef.current!);
    const { data, errorMessages: errors } = parseFormData(formData);

    if (data) {
      setErrorMessages({});
      onSuccessfulChange(data, isNewEntry, questionId);
      return;
    }

    if (errors) {
      setErrorMessages(errors);
    }
  }, [onSuccessfulChange, isNewEntry, questionId]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 1000), [onChange]);

  return (
    <form
      className="flex flex-col"
      onSubmit={onSubmit}
      onChange={debouncedOnChange}
      ref={formRef}
    >
      <Input
        label="Question title"
        placeholder="What is your name ?"
        name="title"
        containerClassName="mb-4"
        error={errorMessages.title}
        defaultValue={props.initialState?.title}
      />
      <Input
        label="Question description"
        placeholder="Type your question here"
        name="description"
        containerClassName="mb-4"
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
          className="mr-2"
          defaultValue={props.initialState?.inputType || INPUT_TYPES[0].value}
        />
        <Checkbox
          name="isRequired"
          label="Required ?"
          className="mt-6"
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
      {typeof props.questionId !== "undefined" && (
        <input type="hidden" value={props.questionId} name="formId" />
      )}
      <Button
        type="submit"
        intent={INTENT.primary}
        color={COLOR.primary}
        disabled={props.isSubmitting}
        className={twJoin(props.isNewEntry ? "" : "hidden")}
      >
        {typeof props.questionId === "undefined" ? "Add" : "Update"}
      </Button>
    </form>
  );
}

export default Form;
