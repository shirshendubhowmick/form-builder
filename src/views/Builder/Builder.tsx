import { useCallback, useState } from "react";

import Button, { COLOR, INTENT } from "~/components/Button/Button";
import { BuilderFormData } from "~/schemas/builder";

import Form from "./components/Form/Form";

function Builder() {
  const [inputs, setInputs] = useState<BuilderFormData[]>([]);
  const [showBuilderForm, setShowBuilderForm] = useState(false);

  const onSuccessfulAdd = useCallback((data: BuilderFormData) => {
    setInputs((prev) => [...prev, data]);
  }, []);

  const onAddMore = useCallback(() => {
    setShowBuilderForm(true);
  }, []);

  return (
    <div>
      <h1 className="mb-8">Form builder</h1>
      <div>
        {inputs.map((input, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <pre>{JSON.stringify(input, null, 2)}</pre>
          </div>
        ))}

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
