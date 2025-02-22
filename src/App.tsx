import { useCallback, useState } from "react";

import Button, { COLOR, INTENT, SIZE } from "./components/Button/Button";
import { BuilderFormData } from "./schemas/builder";
import Builder from "./views/Builder/Builder";
import Renderer from "./views/Renderer/Renderer";

function App() {
  const [builderFormData, setBuilderFormData] = useState<BuilderFormData[]>([
    {
      title: "asdasd",
      description: "asdasd",
      isRequired: false,
      inputType: "text",
      maxLength: 7,
      minLength: 5,
    },
  ]);

  const [viewMode, setViewMode] = useState<"builder" | "preview">("builder");

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "builder" ? "preview" : "builder"));
  }, []);

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
          builderFormData={builderFormData}
          setBuilderFormData={setBuilderFormData}
        />
      ) : (
        <Renderer />
      )}
    </main>
  );
}

export default App;
