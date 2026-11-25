import type { ReactNode } from 'react';
import { SvgXml } from 'react-native-svg';
import type { HomePreviewRenderProps, IHomePreview } from './types';

export class SvgHomePreview implements IHomePreview {
  public constructor(public readonly xml: string) {}

  public render({ size, testID }: HomePreviewRenderProps): ReactNode {
    return <SvgXml xml={this.xml} width={size} height={size} testID={testID} />;
  }
}
