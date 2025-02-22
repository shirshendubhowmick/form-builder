import { useCallback, useState } from "react";

import Button, { COLOR, INTENT, SIZE } from "./components/Button/Button";
import { BuilderFormData } from "./schemas/builder";
import Builder from "./views/Builder/Builder";
import Renderer from "./views/Renderer/Renderer";

function App() {
  const [builderFormData, setBuilderFormData] = useState<BuilderFormData[]>([
    {
      title: "This is text",
      description: "",
      isRequired: true,
      inputType: "text",
      maxLength: 100,
      minLength: 4,
    },
    {
      title: "This is number",
      description: "Some description",
      isRequired: false,
      inputType: "number",
      maxValue: 564,
      minValue: -8,
    },
    {
      title: "This is option",
      description: "Some description",
      isRequired: false,
      inputType: "options",
      options: [
        {
          label: "Option 1",
          value: "Option 1",
        },
        {
          label: "Option 2",
          value: "Option 2",
        },
        {
          label: "Option 3",
          value: "Option 3",
        },
        {
          label: "Option 4",
          value: "Option 4",
        },
      ],
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
        <Renderer schema={builderFormData} />
      )}
    </main>
  );
}

export default App;
