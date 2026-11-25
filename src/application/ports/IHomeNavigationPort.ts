export type HomeDestination =
  | 'DIRECT'
  | 'LEVELS'
  | 'SETTINGS'
  | 'LOGIN'
  | 'RANKING';

export interface IHomeNavigationPort {
  navigate(destination: HomeDestination): void;
}
