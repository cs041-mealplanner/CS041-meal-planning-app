import { generateClient } from "aws-amplify/data";

export const MODEL_AUTH_OPTIONS = {
  authMode: "userPool",
};

const dataClient = generateClient();
const warnedModels = new Set();

export function getDataModel(modelName) {
  const model = dataClient?.models?.[modelName];

  if (!model && !warnedModels.has(modelName)) {
    console.warn(
      `Amplify Data model "${modelName}" is unavailable. Sync the backend schema and regenerate amplify_outputs.json.`
    );
    warnedModels.add(modelName);
  }

  return model ?? null;
}
