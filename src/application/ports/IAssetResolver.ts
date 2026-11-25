export interface IAssetResolver<TAsset> {
  resolve(key: string): TAsset | null;
}
