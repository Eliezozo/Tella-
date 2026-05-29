export type CreationFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const creationFormInitialState: CreationFormState = { ok: false };
