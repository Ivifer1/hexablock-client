import type { IHomePreview } from './types';

export interface HomePreviewVisualProps {
  readonly preview: IHomePreview;
  readonly size: number;
  readonly testID?: string;
  readonly reduceMotion?: boolean;
}

export function HomePreviewVisual({
  preview,
  size,
  testID,
  reduceMotion,
}: HomePreviewVisualProps) {
  return <>{preview.render({ size, testID, reduceMotion })}</>;
}
