import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import Checkbox from "~/components/Checkbox/Checkbox";
import Input from "~/components/Input/Input";
import SelectInput from "~/components/SelectInput/SelectInput";
import { BuilderSchema } from "~/schemas/builder";
import { LabelValuePair } from "~/types";

const inputTypes = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "options",
    label: "Options",
  },
] as const;

function InputTypeComponent(props: {
  type: (typeof inputTypes)[number]["value"];
}) {
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
          />
          <Input
            label="Maximum length"
            placeholder="12"
            name="maxLength"
            type="number"
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
          />
          <Input
            label="Maximum value"
            placeholder="1080"
            name="maxValue"
            type="number"
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

function Form() {
  const [inputType, setInputType] = useState<
    (typeof inputTypes)[number]["value"] | null
  >(null);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
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
          formData.delete(key);
        }
      });

      const data = BuilderSchema.parse({
        ...Object.fromEntries(formData.entries()),
        options,
      });
      console.log(data);
      return;
    }

    const data = BuilderSchema.parse(Object.fromEntries(formData.entries()));
    console.log(data);
  }, []);

  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <Input
        label="Question title"
        placeholder="What is your name ?"
        name="title"
        className="mb-4"
      />
      <Input
        label="Question description"
        placeholder="Type your question here"
        name="description"
        className="mb-4"
      />
      <div className="mb-4 flex items-center">
        <SelectInput<(typeof inputTypes)[number]["value"]>
          placeholder="Input type"
          options={inputTypes}
          label="Select an input type"
          name="inputType"
          ariaLabel="Input type"
          onValueChange={setInputType}
          className="mr-8"
        />
        <Checkbox name="isRequired" label="Required ?" className="mt-4" />
      </div>
      {Boolean(inputType) && <InputTypeComponent type={inputType!} />}
      <Button type="submit" intent={INTENT.primary} color={COLOR.primary}>
        Add
      </Button>
    </form>
  );
}

export default Form;
