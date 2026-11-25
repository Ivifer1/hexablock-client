export type PreferenceSaveResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason?: string };
