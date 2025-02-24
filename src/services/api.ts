import { BuilderFormData } from "~/schemas/builder";

const delayInMs = 3000;
const errorProbability = 0.1;

function randomIsError(trueProbability: number): boolean {
  const probability = Math.max(0, Math.min(1, trueProbability));

  return Math.random() < probability;
}

export type Schemas = Record<string, BuilderFormData[]>;

const LOCAL_STORAGE_SCHEMA_KEY = "schema";

export async function addQuestion(
  inputSchemas: BuilderFormData[],
  schemaId?: number,
): Promise<{ schemaId: string; lastInsertedQuestionId: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to add question"));
        return;
      }

      if (schemaId) {
        try {
          const existingData = localStorage.getItem(LOCAL_STORAGE_SCHEMA_KEY);
          if (existingData) {
            const parsedData = JSON.parse(existingData) as Schemas;
            parsedData[schemaId] = parsedData[schemaId].concat(inputSchemas);
            localStorage.setItem(
              LOCAL_STORAGE_SCHEMA_KEY,
              JSON.stringify(parsedData),
            );
            resolve({
              schemaId: String(schemaId),
              lastInsertedQuestionId: parsedData[schemaId].length - 1,
            });
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
        localStorage.setItem(
          LOCAL_STORAGE_SCHEMA_KEY,
          JSON.stringify({ [id]: inputSchemas }),
        );
        resolve({
          schemaId: String(id),
          lastInsertedQuestionId: inputSchemas.length,
        });
      } catch (e) {
        reject(e);
      }
    }, delayInMs);
  });
}

export async function updateQuestion(
  inputSchema: BuilderFormData,
  schemaId: number,
  questionId: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to add question"));
        return;
      }
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_SCHEMA_KEY);
        if (existingData) {
          const parsedData = JSON.parse(existingData) as Schemas;
          parsedData[schemaId][questionId] = inputSchema;
          localStorage.setItem(
            LOCAL_STORAGE_SCHEMA_KEY,
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
