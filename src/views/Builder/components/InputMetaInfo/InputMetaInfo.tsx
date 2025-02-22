import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import { InputType } from "~/constants";
import { ErrorMessages } from "~/schemas/builder";

export interface InputMetaInfoProps {
  type: InputType;
  errorMessages: ErrorMessages;
}

function InputMetaInfo(props: InputMetaInfoProps) {
  const [optionIds, setOptionIds] = useState<number[]>([0]);

  const handleAddOption = useCallback(() => {
    setOptionIds((prev) => {
      const lastId = prev[prev.length - 1];
      return [...prev, lastId + 1];
    });
  }, []);

  const handleRemoveOption = useCallback((id: number) => {
    setOptionIds((prev) => {
      return prev.filter((i) => i !== id);
    });
  }, []);

  switch (props.type) {
    case "text":
      return (
        <div className="mb-8 inline-block">
          <Input
            label="Minimum length"
            placeholder="3"
            name="minLength"
            className="mr-8"
            type="number"
            error={props.errorMessages.minLength}
          />
          <Input
            label="Maximum length"
            placeholder="12"
            name="maxLength"
            type="number"
            error={props.errorMessages.maxLength}
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
            className="mr-8"
            type="number"
            error={props.errorMessages.minValue}
          />
          <Input
            label="Maximum value"
            placeholder="1080"
            name="maxValue"
            type="number"
            error={props.errorMessages.minValue}
          />
        </div>
      );
    case "options":
      return (
        <div className="mb-8 flex flex-col">
          {optionIds.map((id, idx) => (
            <div className="flex items-center" key={id}>
              <Input
                label={`Option ${idx + 1}`}
                placeholder="Lorem"
                name={`option-${id}`}
                className="mb-4 mr-4"
              />
              <Button
                type="button"
                intent={INTENT.icon}
                color={COLOR.error}
                disabled={optionIds.length === 1}
                onClick={() => handleRemoveOption(id)}
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
