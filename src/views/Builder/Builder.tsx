import * as Accordion from "@radix-ui/react-accordion";
import {
  BadgeCheck,
  ChevronDownIcon,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import { DEBUG_MODE } from "~/constants";
import { BuilderFormData } from "~/schemas/builder";
import { ValueOf } from "~/types";

import Form from "./components/Form/Form";

const AUTO_SAVE_STATUS = {
  SAVED: "s",
  LOADING: "l",
  IDLE: "i",
} as const;

export interface BuilderProps {
  builderFormData: BuilderFormData[];
  onSubmit: () => Promise<void>;
  onChange: (
    data: BuilderFormData,
    isNewEntry: boolean,
    schemaId?: string,
    questionId?: number,
  ) => Promise<void>;
  onQuestionRemove: (schemaId: string, questionId: number) => Promise<void>;
  schemaId?: string;
}
function Builder(props: BuilderProps) {
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    ValueOf<typeof AUTO_SAVE_STATUS>
  >(AUTO_SAVE_STATUS.IDLE);
  const [isRemoveInProgress, setIsRemoveInProgress] = useState(false);

  const { builderFormData, onSubmit, schemaId, onQuestionRemove, onChange } =
    props;

  const onSuccessfulAddOrUpdate = useCallback(async () => {
    await onSubmit();
    setShowBuilderForm(false);
  }, [onSubmit]);

  const onAddMore = useCallback(() => {
    setShowBuilderForm(true);
  }, []);

  const onRemove = useCallback(
    async (questionId: number) => {
      setIsRemoveInProgress(true);
      await onQuestionRemove(schemaId!, questionId);
      setIsRemoveInProgress(false);
    },
    [schemaId, onQuestionRemove],
  );

  const onSuccessfulChange = useCallback(
    async (data: BuilderFormData, isNewEntry?: boolean, inputId?: number) => {
      setAutoSaveStatus(AUTO_SAVE_STATUS.LOADING);
      await onChange(data, isNewEntry ?? false, schemaId, inputId);
      setAutoSaveStatus(AUTO_SAVE_STATUS.SAVED);
    },
    [onChange, schemaId],
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
                  <div className="ietms-center flex self-end">
                    <span className="p-1">
                      {autoSaveStatus === AUTO_SAVE_STATUS.LOADING && (
                        <LoaderCircle className="animate-spin text-color-primary" />
                      )}
                      {autoSaveStatus === AUTO_SAVE_STATUS.SAVED && (
                        <BadgeCheck className="fade-away text-color-success" />
                      )}
                    </span>
                    <Button
                      intent={INTENT.icon}
                      color={COLOR.error}
                      onClick={() => onRemove(index)}
                      disabled={isRemoveInProgress}
                    >
                      {isRemoveInProgress ? (
                        <LoaderCircle className="animate-spin text-color-primary" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </div>
                  <Form
                    onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate}
                    initialState={input}
                    questionId={index}
                    onSuccessfulChange={onSuccessfulChange}
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
          <Form
            onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate}
            onSuccessfulChange={onSuccessfulChange}
            isNewEntry
          />
        )}
      </div>
    </div>
  );
}

export default Builder;
