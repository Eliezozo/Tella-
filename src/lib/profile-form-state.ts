export type ProfileFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const profileFormInitialState: ProfileFormState = {
  ok: false,
};
