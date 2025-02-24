export const INPUT_TYPES = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "options",
    label: "Options",
  },
] as const;

export type InputType = (typeof INPUT_TYPES)[number]["value"];

export const DEBUG_MODE = false;
