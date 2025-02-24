import { BuilderFormData } from "~/schemas/builder";

const delayInMs = 3000;
const errorProbability = 0.1;

function randomIsError(trueProbability: number): boolean {
  const probability = Math.max(0, Math.min(1, trueProbability));

  return Math.random() < probability;
}

export async function addQuestion(
  inputSchemas: BuilderFormData[],
  schemaId?: number,
): Promise<{ id: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to add question"));
        return;
      }

      if (schemaId) {
        try {
          const existingData = localStorage.getItem(`schema:${schemaId}`);
          if (existingData) {
            const parsedData = JSON.parse(existingData);
            const updatedData = [...parsedData, ...inputSchemas];
            localStorage.setItem(
              `schema:${schemaId}`,
              JSON.stringify(updatedData),
            );
            resolve({ id: schemaId });
            return;
          }
          reject(new Error(`Schema with ${schemaId} not found`));
        } catch (e) {
          reject(e);
          return;
        }
      }

      try {
        const id = new Date().getTime();
        localStorage.setItem(`schema:${id}`, JSON.stringify(inputSchemas));
        resolve({ id });
      } catch (e) {
        reject(e);
      }
    }, delayInMs);
  });
}

export async function updateQuestion(
  inputSchema: BuilderFormData,
  schemaId: number,
  inputId: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to add question"));
        return;
      }
      try {
        const existingData = localStorage.getItem(`schema:${schemaId}`);
        if (existingData) {
          const parsedData = JSON.parse(existingData) as BuilderFormData[];
          parsedData[inputId] = inputSchema;
          localStorage.setItem(
            `schema:${schemaId}`,
            JSON.stringify(parsedData),
          );
          resolve();
          return;
        }
        reject(new Error(`Schema with ${schemaId} not found`));
      } catch (e) {
        reject(e);
      }
    }, delayInMs);
  });
}
