import type { IAssetResolver } from '../../application/ports';

/**
 * Resolves static assets by key without concrete variant branches.
 */
export class StaticAssetResolver<TAsset> implements IAssetResolver<TAsset> {
  private readonly entries: Readonly<Record<string, TAsset>>;

  public constructor(entries: Readonly<Record<string, TAsset>>) {
    this.entries = { ...entries };
  }

  public resolve(key: string): TAsset | null {
    if (!Object.prototype.hasOwnProperty.call(this.entries, key)) {
      return null;
    }
    return this.entries[key] ?? null;
  }
}
