import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import { InputType } from "~/constants";
import {
  BuilderFormData,
  BuilderFormNumberInputData,
  BuilderFormTextInputData,
  ErrorMessages,
} from "~/schemas/builder";

export interface InputMetaInfoProps {
  type: InputType;
  errorMessages: ErrorMessages;
  initialState?: BuilderFormData;
}

function getIntialState(initialState?: BuilderFormData) {
  if (initialState?.inputType === "options") {
    return initialState.options.map((option, idx) => ({
      id: idx,
      defaultValue: option.value,
    }));
  }

  return [{ id: 0, defaultValue: "" }];
}

function InputMetaInfo(props: InputMetaInfoProps) {
  const [optionIds, setOptionIds] = useState<
    { id: number; defaultValue?: string }[]
  >(getIntialState(props.initialState));

  const handleAddOption = useCallback(() => {
    setOptionIds((prev) => {
      const lstIetm = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: lstIetm.id + 1,
          defaultValue: "",
        },
      ];
    });
  }, []);

  const handleRemoveOption = useCallback((id: number) => {
    setOptionIds((prev) => {
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  switch (props.type) {
    case "text":
      return (
        <div className="mb-8 inline-flex flex-col">
          <Input
            label="Minimum length"
            placeholder="3"
            name="minLength"
            containerClassName="mb-4 mr-8 w-full"
            className="w-1/4"
            type="number"
            error={props.errorMessages.minLength}
            defaultValue={
              (props.initialState as BuilderFormTextInputData)?.minLength
            }
          />
          <Input
            label="Maximum length"
            placeholder="255"
            name="maxLength"
            type="number"
            error={props.errorMessages.maxLength}
            defaultValue={
              (props.initialState as BuilderFormTextInputData)?.maxLength
            }
            containerClassName="mb-4 mr-8 w-full"
            className="w-1/4"
          />
        </div>
      );
    case "number":
      return (
        <div className="mb-8 inline-block">
          <Input
            label="Minimum value"
            placeholder="720"
            name="minValue"
            containerClassName="mb-4 mr-8 w-full"
            className="w-1/4"
            type="number"
            error={props.errorMessages.minValue}
            defaultValue={
              (props.initialState as BuilderFormNumberInputData)?.minValue ??
              undefined
            }
          />
          <Input
            label="Maximum value"
            placeholder="1080"
            name="maxValue"
            type="number"
            error={props.errorMessages.minValue}
            defaultValue={
              (props.initialState as BuilderFormNumberInputData)?.maxValue ??
              undefined
            }
            containerClassName="mb-4 mr-8 w-full"
            className="w-1/4"
          />
        </div>
      );
    case "options":
      return (
        <div className="mb-8 flex flex-col">
          {optionIds.map((item, idx) => (
            <div className="flex items-center" key={item.id}>
              <Input
                label={`Option ${idx + 1}`}
                placeholder="Lorem"
                name={`option-${item.id}`}
                containerClassName="mb-4 mr-4"
                error={props.errorMessages.options?.[item.id]}
                defaultValue={item.defaultValue}
              />
              <Button
                type="button"
                intent={INTENT.icon}
                color={COLOR.error}
                disabled={optionIds.length === 1}
                onClick={() => handleRemoveOption(item.id)}
                className="mb-4"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddOption}
            intent={INTENT.secondary}
            color={COLOR.primary}
            className="self-end"
          >
            Add option
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default InputMetaInfo;
