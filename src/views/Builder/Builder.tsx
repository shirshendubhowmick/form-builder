import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import { DEBUG_MODE } from "~/constants";
import { BuilderFormData } from "~/schemas/builder";

import Form from "./components/Form/Form";

export interface BuilderProps {
  builderFormData: BuilderFormData[];
  setBuilderFormData: React.Dispatch<React.SetStateAction<BuilderFormData[]>>;
}
function Builder(props: BuilderProps) {
  const [showBuilderForm, setShowBuilderForm] = useState(false);

  const { builderFormData, setBuilderFormData } = props;

  const onSuccessfulAddOrUpdate = useCallback(
    (data: BuilderFormData, formId?: number) => {
      if (typeof formId === "undefined") {
        setBuilderFormData((prev) => [...prev, data]);
      } else {
        setBuilderFormData((prev) => {
          const newInputs = [...prev];
          newInputs[formId] = data;
          return newInputs;
        });
      }
      setShowBuilderForm(false);
    },
    [setBuilderFormData],
  );

  const onAddMore = useCallback(() => {
    setShowBuilderForm(true);
  }, []);

  const onRemove = useCallback(
    (formId: number) => {
      setBuilderFormData((prev) => {
        const newInputs = [...prev];
        newInputs.splice(formId, 1);
        return newInputs;
      });
    },
    [setBuilderFormData],
  );

  return (
    <div>
      <h1 className="mb-8">Form builder</h1>
      <div>
        <Accordion.Root type="single" collapsible>
          {builderFormData.map((input, index) => (
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
                <div className="flex flex-col">
                  <Button
                    intent={INTENT.icon}
                    color={COLOR.error}
                    className="self-end"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 />
                  </Button>
                  <Form
                    onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate}
                    initialState={input}
                    formId={index}
                  />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {Boolean(builderFormData.length) && !showBuilderForm && (
          <Button
            color={COLOR.primary}
            intent={INTENT.primary}
            onClick={onAddMore}
          >
            Add more
          </Button>
        )}
        {(!builderFormData.length || showBuilderForm) && (
          <Form onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate} />
        )}
      </div>
    </div>
  );
}

export default Builder;
