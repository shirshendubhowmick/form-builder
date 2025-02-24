import { BuilderFormData } from "~/schemas/builder";

const delayInMs = 100;
const errorProbability = 0.1;

function randomIsError(trueProbability: number): boolean {
  const probability = Math.max(0, Math.min(1, trueProbability));

  return Math.random() < probability;
}

type SchemaStorage = Record<string, BuilderFormData[]>;
export type Schema = {
  id: string;
  data: BuilderFormData[];
};

const LOCAL_STORAGE_SCHEMA_KEY = "schema";

function convertStorageToSchema(storageSchema: SchemaStorage): Schema[] {
  return Object.entries(storageSchema).map(([key, value]) => {
    return {
      id: key,
      data: value,
    };
  });
}

export async function addSchema(
  inputSchemas: BuilderFormData[],
  schemaId?: string,
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
            const parsedData = JSON.parse(existingData) as SchemaStorage;
            parsedData[schemaId] = parsedData[schemaId].concat(inputSchemas);
            localStorage.setItem(
              LOCAL_STORAGE_SCHEMA_KEY,
              JSON.stringify(parsedData),
            );
            resolve({
              schemaId,
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

export async function updateSchema(
  inputSchema: BuilderFormData,
  schemaId: string,
  questionId: number,
): Promise<Schema[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to add question"));
        return;
      }
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_SCHEMA_KEY);
        if (existingData) {
          const parsedData = JSON.parse(existingData) as SchemaStorage;
          parsedData[schemaId][questionId] = inputSchema;
          localStorage.setItem(
            LOCAL_STORAGE_SCHEMA_KEY,
            JSON.stringify(parsedData),
          );
          resolve(convertStorageToSchema(parsedData));
          return;
        }
        reject(new Error(`Schema with ${schemaId} not found`));
      } catch (e) {
        reject(e);
      }
    }, delayInMs);
  });
}

export async function getSchemas(): Promise<Schema[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(errorProbability)) {
        reject(new Error("Failed to get questions"));
        return;
      }
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_SCHEMA_KEY);
        if (existingData) {
          const parsedData = JSON.parse(existingData) as SchemaStorage;
          resolve(convertStorageToSchema(parsedData));
          return;
        }
        reject(new Error(`No schemas found`));
      } catch (e) {
        reject(e);
      }
    }, delayInMs);
  });
}

export async function deleteQuestionFromSchema(
  schemaId: string,
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
          const parsedData = JSON.parse(existingData) as SchemaStorage;
          const updatedData = parsedData[schemaId].filter(
            (_, idx) => idx !== questionId,
          );
          parsedData[schemaId] = updatedData;
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
