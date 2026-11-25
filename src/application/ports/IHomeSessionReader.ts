export interface HomeSessionSnapshot {
  readonly isAuthenticated: boolean;
  readonly displayName: string | null;
}

export interface IHomeSessionReader {
  getSnapshot(): HomeSessionSnapshot;
}
