import type { ReactNode } from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import type { HomePreviewRenderProps, IHomePreview } from './types';

export class ImageHomePreview implements IHomePreview {
  public constructor(public readonly source: ImageSourcePropType) {}

  public render({ size, testID }: HomePreviewRenderProps): ReactNode {
    return (
      <Image
        source={this.source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        testID={testID}
      />
    );
  }
}
