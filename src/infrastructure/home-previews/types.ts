import type { ImageSourcePropType } from 'react-native';

export type HomePreviewAsset =
  | { readonly kind: 'svg'; readonly xml: string }
  | { readonly kind: 'image'; readonly source: ImageSourcePropType };
