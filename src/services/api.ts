import { BuilderFormData } from "~/schemas/builder";

const DELAY_IN_MS = 100;
const ERROR_PROBABILITY = 0.1;
const LOCAL_STORAGE_SCHEMA_KEY = "schema";
const LOCAL_STORAGE_DRAFT_KEY = "draft";

function randomIsError(trueProbability: number): boolean {
  const probability = Math.max(0, Math.min(1, trueProbability));

  return Math.random() < probability;
}

type SchemaStorage = Record<string, BuilderFormData[]>;
export type Schema = {
  id: string;
  data: BuilderFormData[];
};

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
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
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
    }, DELAY_IN_MS);
  });
}

export async function updateSchema(
  inputSchema: BuilderFormData,
  schemaId: string,
  questionId: number,
): Promise<Schema[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
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
    }, DELAY_IN_MS);
  });
}

export async function getSchemas(): Promise<Schema[] | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
        return;
      }
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_SCHEMA_KEY);
        if (existingData) {
          const parsedData = JSON.parse(existingData) as SchemaStorage;
          resolve(convertStorageToSchema(parsedData));
          return;
        }
        resolve(null);
      } catch (e) {
        reject(e);
      }
    }, DELAY_IN_MS);
  });
}

export async function deleteQuestionFromSchema(
  schemaId: string,
  questionId: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
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
    }, DELAY_IN_MS);
  });
}

export async function createDraftEntry(data: BuilderFormData): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
        return;
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(data));
        resolve();
      } catch (e) {
        reject(e);
      }
    }, DELAY_IN_MS);
  });
}

export async function getDraftEntry(): Promise<BuilderFormData | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
        return;
      }
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
        if (existingData) {
          resolve(JSON.parse(existingData));
          return;
        }
        resolve(null);
      } catch (e) {
        reject(e);
      }
    }, DELAY_IN_MS);
  });
}

export async function deleteDraftEntry(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomIsError(ERROR_PROBABILITY)) {
        reject(new Error("Simulated error"));
        return;
      }
      try {
        localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
        resolve();
      } catch (e) {
        reject(e);
      }
    }, DELAY_IN_MS);
  });
}
