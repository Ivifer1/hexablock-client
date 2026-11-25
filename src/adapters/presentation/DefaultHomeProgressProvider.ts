import type { GameModeDescriptor } from '../../application/modes';
import type { IHomeProgressProvider } from '../../application/ports';
import type { HomeProgressDTO } from '../../application/value-objects';

export type HomeProgressMapper = (descriptor: GameModeDescriptor) => HomeProgressDTO;

const DEFAULT_PROGRESS_MAPPERS: Readonly<Record<string, HomeProgressMapper>> = {
  best: () => ({ kind: 'NONE' }),
  levels: (descriptor) => ({
    kind: 'LEVELS',
    completed: 0,
    total: descriptor.totalLevels ?? 0,
  }),
  none: () => ({ kind: 'NONE' }),
};

/**
 * Maps a registered mode descriptor's progress strategy to a HomeProgressDTO.
 */
export class DefaultHomeProgressProvider implements IHomeProgressProvider {
  private readonly mappers: Readonly<Record<string, HomeProgressMapper>>;

  public constructor(customMappers: Readonly<Record<string, HomeProgressMapper>> = {}) {
    this.mappers = {
      ...DEFAULT_PROGRESS_MAPPERS,
      ...customMappers,
    };
  }

  public getProgress(descriptor: GameModeDescriptor): HomeProgressDTO {
    if (!Object.prototype.hasOwnProperty.call(this.mappers, descriptor.progressDescriptor)) {
      return { kind: 'NONE' };
    }
    const mapper = this.mappers[descriptor.progressDescriptor];
    return mapper ? mapper(descriptor) : { kind: 'NONE' };
  }
}
