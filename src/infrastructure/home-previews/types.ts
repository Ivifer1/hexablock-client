import type { ReactNode } from 'react';

export interface HomePreviewRenderProps {
  readonly size: number;
  readonly testID?: string;
  readonly reduceMotion?: boolean;
}

export interface IHomePreview {
  render(props: HomePreviewRenderProps): ReactNode;
}
