import type { VictoryViewDTO } from '../../value-objects/victory.dto';

export interface IVictoryOutputPort {
  presentVictory(view: VictoryViewDTO): void;
}
