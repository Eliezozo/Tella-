export type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  pendingApproval?: boolean;
  registeredHandle?: string;
  registeredEmail?: string;
  registeredAtelierName?: string;
};

export const authFormInitialState: AuthFormState = { ok: false };
