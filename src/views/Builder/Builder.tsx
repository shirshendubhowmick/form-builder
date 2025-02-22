import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import { BuilderFormData } from "~/schemas/builder";

import Form from "./components/Form/Form";

function Builder() {
  const [inputs, setInputs] = useState<BuilderFormData[]>([]);
  const [showBuilderForm, setShowBuilderForm] = useState(false);

  const onSuccessfulAdd = useCallback((data: BuilderFormData) => {
    setInputs((prev) => [...prev, data]);
    setShowBuilderForm(false);
  }, []);

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
                Test 123
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
          <Form onSuccessfulAdd={onSuccessfulAdd} />
        )}
      </div>
    </div>
  );
}

export default Builder;
