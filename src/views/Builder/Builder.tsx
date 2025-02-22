import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import { DEBUG_MODE } from "~/constants";
import { BuilderFormData } from "~/schemas/builder";

import Form from "./components/Form/Form";

function Builder() {
  const [inputs, setInputs] = useState<BuilderFormData[]>([
    {
      title: "asdasd",
      description: "asdasd",
      isRequired: false,
      inputType: "text",
      maxLength: 7,
      minLength: 5,
    },
  ]);
  const [showBuilderForm, setShowBuilderForm] = useState(false);

  const onSuccessfulAddOrUpdate = useCallback(
    (data: BuilderFormData, formId?: number) => {
      if (typeof formId === "undefined") {
        setInputs((prev) => [...prev, data]);
      } else {
        setInputs((prev) => {
          const newInputs = [...prev];
          newInputs[formId] = data;
          return newInputs;
        });
      }
      setShowBuilderForm(false);
    },
    [],
  );

  const onAddMore = useCallback(() => {
    setShowBuilderForm(true);
  }, []);

  return (
    <div>
      <h1 className="mb-8">Form builder</h1>
      <div>
        <Accordion.Root type="single">
          {inputs.map((input, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Accordion.Item key={index} value={String(index)}>
              <Accordion.Trigger className="group mb-4 flex w-full items-center justify-between rounded border border-s border-color-border bg-color-background p-4 text-left">
                <span>{input.title}</span>
                <ChevronDownIcon
                  aria-hidden
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
              <Accordion.Content className="mb-4 border-b p-4">
                {DEBUG_MODE && (
                  <pre className="mb-8">{JSON.stringify(input, null, 2)}</pre>
                )}

                <Form
                  onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate}
                  initialState={input}
                  formId={index}
                />
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {Boolean(inputs.length) && !showBuilderForm && (
          <Button
            color={COLOR.primary}
            intent={INTENT.primary}
            onClick={onAddMore}
          >
            Add more
          </Button>
        )}
        {(!inputs.length || showBuilderForm) && (
          <Form onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate} />
        )}
      </div>
    </div>
  );
}

export default Builder;
