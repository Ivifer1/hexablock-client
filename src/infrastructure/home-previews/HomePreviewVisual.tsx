import { Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { HomePreviewAsset } from './types';

export interface HomePreviewVisualProps {
  readonly asset: HomePreviewAsset;
  readonly size: number;
  readonly testID?: string;
}

export function HomePreviewVisual({ asset, size, testID }: HomePreviewVisualProps) {
  if (asset.kind === 'svg') {
    return <SvgXml xml={asset.xml} width={size} height={size} testID={testID} />;
  }

  return (
    <Image
      source={asset.source}
      style={{ width: size, height: size }}
      resizeMode="contain"
      testID={testID}
    />
  );
}
