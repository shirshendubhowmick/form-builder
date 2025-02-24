import { useCallback, useEffect, useState } from "react";

import Button, { COLOR, INTENT, SIZE } from "./components/Button/Button";
import { BuilderFormData } from "./schemas/builder";
import {
  addSchema,
  deleteQuestionFromSchema,
  getSchemas,
  updateSchema,
} from "./services/api";
import Builder from "./views/Builder/Builder";
import Renderer from "./views/Renderer/Renderer";

function App() {
  const [builderFormSchema, setBuilderFormSchema] = useState<
    {
      id: string;
      data: BuilderFormData[];
    }[]
  >([]);
  const [viewMode, setViewMode] = useState<"builder" | "preview">("builder");
  const [isLoading, setIsLoading] = useState(true);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "builder" ? "preview" : "builder"));
  }, []);

  const handleBuilderFormDataSubmit = useCallback(
    async (data: BuilderFormData, schemaId?: string, questionId?: number) => {
      try {
        if (schemaId && questionId) {
          const updatedData = await updateSchema(data, schemaId, questionId);
          setBuilderFormSchema(updatedData);
          return;
        }
        await addSchema([data], schemaId);
        const updatedData = await getSchemas();
        setBuilderFormSchema(updatedData);
      } catch (e) {
        // TODO : Error handling
      }
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
    getSchemas()
      .then((schemas) => {
        setBuilderFormSchema(schemas);
        setIsLoading(false);
      })
      .catch(() => {
        // TODO : Error handling
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
      >
        Switch to {viewMode === "builder" ? "Preview" : "Builder"}
      </Button>
      {viewMode === "builder" ? (
        <Builder
          onQuestionRemove={handleQuestionRemove}
          // We as of now only support one form
          builderFormData={builderFormSchema[0].data}
          onSubmit={handleBuilderFormDataSubmit}
          schemaId={builderFormSchema[0].id}
          onChange={handleBuilderFormDataSubmit}
        />
      ) : (
        <Renderer schema={builderFormSchema[0].data} />
      )}
    </main>
  );
}

export default App;
