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
  draftEntry: BuilderFormData | null;
  onSubmit: (data: BuilderFormData, schemaId?: string) => Promise<void>;
  onChange: (
    data: BuilderFormData,
    isNewEntry: boolean,
    schemaId?: string,
    questionId?: number,
  ) => void;
  onQuestionRemove: (schemaId: string, questionId: number) => Promise<void>;
  schemaId?: string;
}
function Builder(props: BuilderProps) {
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    ValueOf<typeof AUTO_SAVE_STATUS>
  >(AUTO_SAVE_STATUS.IDLE);
  const [isRemoveInProgress, setIsRemoveInProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { builderFormData, onSubmit, schemaId, onQuestionRemove, onChange } =
    props;

  const onSuccessfulAddOrUpdate = useCallback(
    async (data: BuilderFormData) => {
      setIsSubmitting(true);
      await onSubmit(data, schemaId);
      setShowBuilderForm(false);
      setIsSubmitting(false);
    },
    [onSubmit, schemaId],
  );

  const onAddMoreQuestion = useCallback(() => {
    setShowBuilderForm(true);
  }, []);

  const onRemoveQuestion = useCallback(
    async (questionId: number) => {
      setIsRemoveInProgress(true);
      await onQuestionRemove(schemaId!, questionId);
      setIsRemoveInProgress(false);
    },
    [schemaId, onQuestionRemove],
  );

  const onSuccessfulChange = useCallback(
    async (
      data: BuilderFormData,
      isNewEntry?: boolean,
      questionId?: number,
    ) => {
      setAutoSaveStatus(AUTO_SAVE_STATUS.LOADING);
      await onChange(data, isNewEntry ?? false, schemaId, questionId);

      setAutoSaveStatus(AUTO_SAVE_STATUS.SAVED);
    },
    [onChange, schemaId],
  );

  const shouldShowAddMoreButton =
    Boolean(builderFormData.length) && !showBuilderForm && !props.draftEntry;

  const shouldShowNewQuestiopnForm =
    !builderFormData.length || showBuilderForm || props.draftEntry;

  return (
    <div>
      <h1 className="mb-8">Form builder</h1>
      <div className="mx-auto max-w-3xl">
        <Accordion.Root type="single" collapsible className="w-full">
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
                        <BadgeCheck className="text-color-success" />
                      )}
                    </span>
                    <Button
                      intent={INTENT.icon}
                      color={COLOR.error}
                      onClick={() => onRemoveQuestion(index)}
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
                    isSubmitting={false}
                  />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {shouldShowAddMoreButton && (
          <Button
            color={COLOR.primary}
            intent={INTENT.primary}
            onClick={onAddMoreQuestion}
          >
            Add more
          </Button>
        )}
        {shouldShowNewQuestiopnForm && (
          <>
            <div className="flex min-h-6 justify-end">
              {autoSaveStatus === AUTO_SAVE_STATUS.LOADING && (
                <LoaderCircle className="animate-spin text-color-primary" />
              )}
              {autoSaveStatus === AUTO_SAVE_STATUS.SAVED && (
                <BadgeCheck className="fade-away text-color-success" />
              )}
            </div>
            <Form
              onSuccessfulAddOrUpdate={onSuccessfulAddOrUpdate}
              onSuccessfulChange={onSuccessfulChange}
              isNewEntry
              initialState={props.draftEntry ?? undefined}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Builder;
