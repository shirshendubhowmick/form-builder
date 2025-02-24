import { useCallback, useEffect, useState } from "react";

import Button, { COLOR, INTENT, SIZE } from "./components/Button/Button";
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
  const [viewMode, setViewMode] = useState<"builder" | "preview">("builder");
  const [isLoading, setIsLoading] = useState(true);
  const [initialDraftEntry, setInitialDraftEntry] =
    useState<BuilderFormData | null>(null);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "builder" ? "preview" : "builder"));
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
        if (schemaId && questionId) {
          const updatedData = await updateSchema(data, schemaId, questionId);
          if (!isNewEntry) {
            setBuilderFormSchema(updatedData);
          }
          return;
        }
        // New entry case
        if (isNewEntry) {
          await createDraftEntry(data);
          return;
        }

        const updatedData = await getSchemas();
        await deleteDraftEntry();
        setBuilderFormSchema(updatedData);
      } catch (e) {
        // TODO : Error handling
      }
    },
    [],
  );

  const handleBuilderFormSubmit = useCallback(
    async (data: BuilderFormData, schemaId?: string) => {
      await addSchema([data], schemaId);
      const promises = await Promise.all([getSchemas(), deleteDraftEntry()]);
      setBuilderFormSchema(promises[0]);
      setInitialDraftEntry(null);
    },
    [],
  );

  const handleQuestionRemove = useCallback(
    async (schemaId: string, questionId: number) => {
      await deleteQuestionFromSchema(schemaId, questionId);
      const updatedData = await getSchemas();
      setBuilderFormSchema(updatedData);
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
        // TODO : Error handling
        console.log("Error fetching data");
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="mx-auto flex max-w-screen-xl flex-col p-6">
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
    </main>
  );
}

export default App;
