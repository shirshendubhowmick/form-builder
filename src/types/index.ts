export type LabelValuePair = {
  label: string;
  value: string;
};

export type ValueOf<T> = T[keyof T];
