import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Button, { COLOR, INTENT, SIZE } from "./components/Button/Button";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { BuilderFormData } from "./schemas/builder";
import {
  addSchema,
  createDraftEntry,
  deleteDraftEntry,
  deleteQuestionFromSchema,
  getDraftEntry,
  getSchemas,
  updateSchema,
} from "./services/api";
import { getView, setView } from "./services/storage";
import Builder from "./views/Builder/Builder";
import Renderer from "./views/Renderer/Renderer";

function App() {
  const [builderFormSchema, setBuilderFormSchema] = useState<
    | {
        id: string;
        data: BuilderFormData[];
      }[]
    | null
  >(null);
  const [viewMode, setViewMode] = useState(getView());
  const [isLoading, setIsLoading] = useState(true);
  const [initialDraftEntry, setInitialDraftEntry] =
    useState<BuilderFormData | null>(null);
  const [hasError, setHasError] = useState(false);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const v = prev === "builder" ? "preview" : "builder";
      setView(v);
      return v;
    });
  }, []);

  const handleBuilderFormDataChange = useCallback(
    async (
      data: BuilderFormData,
      isNewEntry: boolean,
      schemaId?: string,
      questionId?: number,
    ) => {
      try {
        // Update case
        if (schemaId && typeof questionId === "number") {
          const updatedData = await updateSchema(data, schemaId, questionId);
          if (!isNewEntry) {
            setBuilderFormSchema(updatedData);
          }
          return;
        }
        // New entry case
        if (isNewEntry) {
          await createDraftEntry(data);
        }
      } catch (e) {
        toast.error("Something went wrong while saving data");
      }
    },
    [],
  );

  const handleBuilderFormSubmit = useCallback(
    async (data: BuilderFormData, schemaId?: string) => {
      try {
        await addSchema([data], schemaId);
        const promises = await Promise.all([getSchemas(), deleteDraftEntry()]);
        setBuilderFormSchema(promises[0]);
        setInitialDraftEntry(null);
        toast.success("Question added successfully");
      } catch (e) {
        toast.error("Something went wrong while adding question");
      }
    },
    [],
  );

  const handleQuestionRemove = useCallback(
    async (schemaId: string, questionId: number) => {
      try {
        await deleteQuestionFromSchema(schemaId, questionId);
        const updatedData = await getSchemas();
        setBuilderFormSchema(updatedData);
      } catch (e) {
        toast.error("Something went wrong while removing question");
      }
    },
    [],
  );

  useEffect(() => {
    const promises = Promise.all([getSchemas(), getDraftEntry()]);

    promises
      .then(([schemas, draftEntry]) => {
        setBuilderFormSchema(schemas);
        setInitialDraftEntry(draftEntry);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Something went wrong while fetching data");
        setHasError(true);
      });
  }, []);

  if (hasError) {
    throw new Error("Unabele to load data");
  }

  return (
    <main className="mx-auto flex max-w-screen-xl flex-col p-6">
      {isLoading ? (
        <div>
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
          <div className="mb-4 h-12 w-full animate-pulse rounded bg-color-background" />
        </div>
      ) : (
        <>
          <Button
            color={COLOR.primary}
            intent={INTENT.secondary}
            size={SIZE.md}
            onClick={toggleViewMode}
            className="self-end"
            disabled={!builderFormSchema}
          >
            Switch to {viewMode === "builder" ? "Preview" : "Builder"}
          </Button>
          {viewMode === "builder" ? (
            <Builder
              onQuestionRemove={handleQuestionRemove}
              // We as of now only support one form
              builderFormData={builderFormSchema?.[0].data ?? []}
              onSubmit={handleBuilderFormSubmit}
              schemaId={builderFormSchema?.[0].id}
              onChange={handleBuilderFormDataChange}
              draftEntry={initialDraftEntry}
            />
          ) : (
            <Renderer schema={builderFormSchema?.[0].data!} />
          )}
        </>
      )}
    </main>
  );
}

function Root() {
  return (
    <ErrorBoundary>
      <App />
      <ToastContainer position="top-right" autoClose={2000} />
    </ErrorBoundary>
  );
}

export default Root;
